<template>
  <div class="console-panel">
    <VTabBar v-model="activeType">
      <VTabBarItem id="all">All</VTabBarItem>
      <VTabBarItem id="log">Log</VTabBarItem>
      <VTabBarItem id="info">Info</VTabBarItem>
      <VTabBarItem id="warn">Warn</VTabBarItem>
      <VTabBarItem id="error">Error</VTabBarItem>
    </VTabBar>
    <div class="body">
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
import { _console, uuid } from "@/utils";
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
      msgList: []
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
            this.$root.$emit("hide");
          }
        }
      ];
    }
  },
  // hook console 输出越早越好，选择最先被执行的 beforeCreate 周期方法进行 hook 操作
  beforeCreate() {
    // 停止搜集日志（交给 ConsolePanel 进行搜集)
    consoleHooks.uninstall();
    // 开始搜集日志
    const vm = this;
    const originConsole = {};
    const names = ["log", "info", "error", "warn", "debug"];
    names.forEach(name => {
      originConsole[name] = window.console[name];

      window.console[name] = function(...args) {
        const msg = {
          id: uuid(),
          type: name,
          logArgs: args
        };
        // 冻结计算结果，避免 Vue 添加额外属性
        vm.msgList.push(Object.freeze(msg));
        originConsole[name].apply(this, args);
      };
    });
  },
  created() {
    // 将创建之前搜集到的日志按打印顺序追加到日志列表前面
    this.msgList.unshift(...consoleHooks.getMsgList());
  },
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    _console.error(error);
    return false;
  },
  methods: {}
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
