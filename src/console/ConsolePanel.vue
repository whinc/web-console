<template>
  <div class="console-panel">
    <v-tab-bar v-model="activeType">
      <v-tab-bar-item id="all">All</v-tab-bar-item>
      <v-tab-bar-item id="log">Log</v-tab-bar-item>
      <v-tab-bar-item id="info">Info</v-tab-bar-item>
      <v-tab-bar-item id="warn">Warn</v-tab-bar-item>
      <v-tab-bar-item id="error">Error</v-tab-bar-item>
    </v-tab-bar>
    <div class="message-list">
      <message
        v-for="msg in msgList"
        :key="msg.id"
        v-if="msg.type === activeType || activeType === 'all'"
        :msgId="msg.id"
        :type="msg.type"
        :logArgs="msg.logArgs"
      />
    </div>
    <my-foot-bar>
      <my-button @click="onClickClear">Clear</my-button>
      <my-foot-separator/>
      <my-button @click="onClickHide">Hide</my-button>
    </my-foot-bar>
  </div>
</template>

<script>
import Message from "./Message";
import { VTabBar, VTabBarItem, MyButton, MyFootBar, MyFootSeparator } from "@/components";
import { _console, uuid } from "@/utils";

export default {
  components: {
    Message,
    MyButton,
    MyFootSeparator,
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    MyFootBar
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
  // hook console 输出越早越好，选择最先被执行的 beforeCreate 周期方法进行 hook 操作
  beforeCreate() {
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
  methods: {
    onClickClear() {
      this.msgList = [];
    },
    onClickHide() {
      this.$root.$emit("hide");
    }
  },
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    _console.error(error);
    return false;
  }
};
</script>

<style lang="scss" scoped>
@import "../base.scss";

.console-panel {
  height: $panel-height;
  position: relative;
}

.head-bar {
  color: #333;
}

.head-bar .item {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.head-bar .item.selected {
  border-bottom: 1px solid #2196f3;
}

.message-list {
  position: absolute;
  top: 40px;
  bottom: 39px;
  width: 100%;
  left: 0px;
  overflow-y: scroll;
}
</style>
