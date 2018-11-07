<template>
  <div class="console-panel">
    <VTabBar v-model="activeType">
      <VTabBarItem id="all">All</VTabBarItem>
      <VTabBarItem id="log">Log</VTabBarItem>
      <VTabBarItem id="info">Info</VTabBarItem>
      <VTabBarItem id="warn">Warn</VTabBarItem>
      <VTabBarItem id="error">Error</VTabBarItem>
    </VTabBar>
    <div ref="container" @scroll="onScroll" class="body">
      <!-- 不同面板的切换比较频繁，v-show 比 v-if 更适合该场景 -->
      <Message
        v-for="msg in msgList"
        :key="msg.id"
        v-show="msg.type === activeType || activeType === 'all'"
        :msgId="msg.id"
        :type="msg.type"
        :logArgs="msg.logArgs"
      />
    </div>
    <VFootBar class="foot" :buttons="footBarButtons" />
  </div>
</template>

<script>
import Message from "./Message";
import { VTabBar, VTabBarItem, VFootBar } from "@/components";
import { _console, uuid, createStack, eventBus } from "@/utils";
import consoleHooks from "../consoleHooks";

export default {
  components: {
    Message,
    VFootBar,
    VTabBar,
    VTabBarItem
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
      // 个性化设置
      showTimestamps: false
    };
  },
  computed: {
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
  },
  watch: {
    msgList(val) {
      const el = this.$refs.container;
      if (this.isBottom && el) {
        // 待新增的消息渲染完成后，滚动至底部
        this.$nextTick(() => {
          el.scrollTo(0, el.scrollHeight - el.clientHeight);
        });
        // _console.log('scroll to:', el.scrollHeight - el.clientHeight)
      }
      // _console.log('msgList length:', val.length)
    }
  },
  // hook console 输出越早越好，选择最先被执行的 beforeCreate 周期方法进行 hook 操作
  beforeCreate() {
    // 停止搜集日志（交给 ConsolePanel 进行搜集)
    consoleHooks.uninstall();

    const hookConsole = () => {
      const vm = this;
      const originConsole = {};
      const names = ["log", "info", "error", "warn", "debug"];
      names.forEach(name => {
        originConsole[name] = window.console[name];

        window.console[name] = function(...args) {
          const logArgs = args.map(v => {
            if (v instanceof Error) {
              createStack(v, window.console[name]);
            }
            return v;
          });
          const msg = {
            id: uuid(),
            type: name,
            logArgs
          };
          // 错开当前渲染周期，避免当前渲染出现异常时，导致循环渲染输出错误日志
          vm.$nextTick(() => {
            // 冻结计算结果，避免 Vue 添加额外属性
            vm.msgList.push(Object.freeze(msg));
          });
          originConsole[name].apply(this, args);
        };
      });
    };
    // 开始搜集日志
    hookConsole();

    // 弹窗不可见时，新增数据不会滚动，当弹窗变为可见时，需要执行一次滚动至底部来修正滚动位置
    eventBus.on(eventBus.POPUP_VISIBILITY_CHANGE, visible => {
      const el = this.$refs.container;
      if (this.isBottom && el) {
        // 待新增的消息渲染完成后，滚动至底部
        el.scrollTo(0, el.scrollHeight - el.clientHeight);
      }
    });
  },
  created() {
    // 将创建之前搜集到的日志按打印顺序追加到日志列表前面
    this.msgList.unshift(...consoleHooks.getMsgList());

    // 设置发生变化时做出变化
    eventBus.on(eventBus.SETTINGS_CHANGE, settings => {
      this.showTimestamps = !!settings.console.showTimestamps;
    });
  },
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    _console.error(error);
    return false;
  },
  methods: {
    onScroll(event) {
      const el = event.target;
      this.isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
      // _console.log('scrollTop + clientHeight: %s, scrollHeight: %s, isBottom: %s', el.scrollTop + el.clientHeight, el.scrollHeight, this.isBottom)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../base.scss";

.console-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .body {
    flex-grow: 1;
    overflow-y: scroll;
  }
  .foot {
    flex: none;
  }
}
</style>
