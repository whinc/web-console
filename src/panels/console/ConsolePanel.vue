<template>
  <div class="console-panel">
    <div class="head">
      <VTabBar v-model="activeType" :equalWidth="true">
        <VTabBarItem id="all">All</VTabBarItem>
        <VTabBarItem id="log">Log</VTabBarItem>
        <VTabBarItem id="info">Info</VTabBarItem>
        <VTabBarItem id="warn">Warn</VTabBarItem>
        <VTabBarItem id="error">Error</VTabBarItem>
        <VIcon slot="icons" :name="isToolbarExpanded ? 'collapse' : 'expand'" class="head__icon" @click="isToolbarExpanded = !isToolbarExpanded" />
      </VTabBar>
      <div v-if="isToolbarExpanded" class="toolbar">
        <input class="toolbar__input" type="text" placeholder="Filter" v-model="filter" />
      </div>
    </div>

    <div ref="container" @scroll="onScroll" class="body" v-prevent-bkg-scroll>
      <!-- 不同面板的切换比较频繁，v-show 比 v-if 更适合该场景，可以复用 Message 组件 -->
      <Message
        v-for="msg in msgList"
        :key="msg.id"
        v-show="msg.type === activeType || activeType === 'all'"
        :message="msg"
        :showTimestamps="showTimestamps"
        :filter="filter"
      />
    </div>
    <VFootBar class="foot" :buttons="footBarButtons" />
  </div>
</template>

<script>
import { VTabBar, VTabBarItem, VFootBar, VIcon } from "@/components";
import { uuid, createStack, eventBus, TaskScheduler, Logger, consoleHooks, formatFileName } from "@/utils";
import Message from "./Message";
import { isFunction } from "util";

const logger = new Logger("[ConsolePanel]");
const taskScheduler = new TaskScheduler();

export default {
  name: "ConsolePanel",
  components: {
    Message,
    VFootBar,
    VTabBar,
    VTabBarItem,
    VIcon
  },
  data() {
    return {
      activeType: "all",
      /**
       * [{
       *  // 日志类型，取值 all/log/info/error/warn/debug
       *  type: String,
       *  // log 的参数数组
       *  logArgs: Array
       * }]
       */
      msgList: [],
      /**
       * 是否滚动触底
       * 为 true 时，新增消息时滚动条将自动定位到底部
       * 为 false 时，新增消息时滚动条保持位置不变
       */
      isBottom: true,
      // 显示时间戳
      showTimestamps: false,
      // 最大消息数量（超出后移除旧消息）
      maxMsgCount: Infinity,
      // 是否展开工具栏
      isToolbarExpanded: false,
      // 过滤器
      filter: ""
    };
  },
  computed: {
    /* eslint-disable */
    footBarButtons() {
      return [
        {
          text: "Clear",
          click: () => {
            this.msgList = [];
          }
        },
        {
          text: "Hide",
          click: () => {
            eventBus.emit(eventBus.POPUP_HIDE);
          }
        }
      ];
    }
    /* eslint-enable */
  },
  watch: {
    msgList() {
      // 等列表渲染完成后(触发 onScroll 更新 isBottom)，再根据最新的 isBottom 决定是否需要滚动到底部
      this.$nextTick(() => {
        const el = this.$refs.container;
        // logger.log('msgList changed, isBottom:', this.isBottom)
        if (this.isBottom && el && isFunction(HTMLElement.prototype.scrollTo)) {
          // Element 的 scrollTo 还处于工作草案，需判断兼容性
          // 在合适的时机滚动至底部，避免阻塞交互
          el.scrollTo(0, el.scrollHeight - el.clientHeight);
        }
      });
    }
  },
  created() {
    // 搜集 web-console 初始化之前用户输出的日志消息，放入消息队列中
    this.collectUnhandledMessage();

    // 拦截 Console 对象的日志打印方法，将消息放入消息队列中，并启动日志输出
    this.interceptConsole();

    // 处理全局未捕获的异常
    this.handleUncaughtException();

    // 弹窗不可见时，新增数据不会滚动，当弹窗变为可见时，需要执行一次滚动至底部来修正滚动位置
    // TODO: 不是监听弹窗可见，而是监听当前面板可见
    eventBus.on(eventBus.POPUP_VISIBILITY_CHANGE, () => {
      const el = this.$refs.container;
      if (this.isBottom && el && isFunction(HTMLElement.prototype.scrollTo)) {
        // Element 的 scrollTo 还处于工作草案，需判断兼容性
        // 待新增的消息渲染完成后，滚动至底部
        el.scrollTo(0, el.scrollHeight - el.clientHeight);
      }
    });

    // 监听设置变化事件
    eventBus.on(eventBus.SETTINGS_CHANGE, this.onSettingsChanged.bind(this));
  },
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    logger.error(error);
    return false;
  },
  methods: {
    onScroll(event) {
      const el = event.target;
      /**
       * 这里使用 el.scrollHeight - 1 作为右侧判断条件，是因为 v-prevent-bkg-scroll 指令内部
       * 在触底时会强制将滚动内容上移 1px 以避免触底后滚动弹窗底部背景层
       */
      this.isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      // logger.log('scrollTop + clientHeight: %s, scrollHeight: %s, isBottom: %s', el.scrollTop + el.clientHeight, el.scrollHeight, this.isBottom)
    },
    onSettingsChanged(settings) {
      this.showTimestamps = !!settings.showTimestamps;
      this.maxMsgCount = settings.maxMsgCount;
    },
    appendMessage(type, ...args) {
      // 冻结消息对象，避免传递过程中 Vue 添加额外字段
      const msg = Object.freeze({
        id: uuid(),
        type: type,
        // 时间戳取生成消息的时间
        timestamps: Date.now(),
        logArgs: args
      });

      // 1. 性能优化：短时间内批量打印日志时，将打印操作放入队列，之后按顺序依次打印
      // 2. 修复异常：渲染模板中抛出异常时，打印错误消息，走到这里会再次出发渲染，导致死循环，
      //             采用任务队列后，相邻两次打印不在同一个执行堆栈中，可以避免这种情况
      taskScheduler.addAndStart(() => {
        // 移除超出的消息
        while (this.msgList.length >= this.maxMsgCount) this.msgList.shift();

        this.msgList.push(msg);
      });
    },
    collectUnhandledMessage() {
      // 停止搜集日志，交给 ConsolePanel 进行搜集
      consoleHooks.uninstall();
      // 将创建之前搜集到的日志按打印顺序追加到日志列表前面
      // 如果超出最大消息数量，则截取最新的那部分
      const msgList = consoleHooks.getMsgList();
      if (msgList.length > this.maxMsgCount) {
        this.msgList.unshift(...msgList.slice(msgList.length - this.maxMsgCount));
        logger.warn(
          "当前消息数量(%d)超出最大消息数量(%d)，截断后消息数量(%d)",
          msgList.length,
          this.maxMsgCount,
          this.msgList.length
        );
      } else {
        this.msgList.unshift(...msgList);
      }
    },
    // 拦截 Console 日志方法
    interceptConsole() {
      const vm = this;
      const originConsole = {};
      const names = ["log", "info", "error", "warn", "debug"];
      names.forEach(name => {
        originConsole[name] = window.console[name];

        window.console[name] = function(...args) {
          // 如果参数中有 Error 对象，为其生成堆栈信息
          args.forEach(value => {
            if (value instanceof Error) {
              createStack(value, window.console[name]);
            }
          });

          vm.appendMessage(name, ...args);

          originConsole[name].apply(this, args);
        };
      });
    },
    // 处理全局未捕获的异常
    handleUncaughtException() {
      const vm = this;
      // 未捕获的错误
      window.addEventListener("error", function uncaughtExceptionHandler(event) {
        let error = event.error;
        // createStack(error, uncaughtExceptionHandler);

        // if (!error.stack) {
        //   error.stack = event.message + "\nat " + event.filename + ":" + event.lineno + ":" + event.colno;
        // }
        error.stack = formatFileName(error.stack);
        vm.appendMessage("error", error);
      });

      // 未处理的 rejected Promise
      window.addEventListener("unhandledrejection", function unhandledRejectionHandler(event) {
        const error = new Error("(in promise) " + event.reason);
        createStack(error, unhandledRejectionHandler);
        vm.appendMessage("error", error);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

.console-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .head {
    &__icon {
      padding: 0.6em;
      width: 2.4em;
    }
    .toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: $toolbar-bg-color;
      border-bottom: 1px solid $toolbar-border-color;
      height: 2.4em;
      &__input {
        @include input(80%);
        margin: 0 4px;
        padding: 0 4px;
        flex: 1;
      }
    }
  }
  .body {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .foot {
    flex: none;
  }
}
</style>
