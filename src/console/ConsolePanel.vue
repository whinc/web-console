<template>
  <div class="console-panel">
    <tab-bar v-model="activeType">
      <tab-item id="all">All</tab-item>
      <tab-item id="log">Log</tab-item>
      <tab-item id="info">Info</tab-item>
      <tab-item id="warn">Warn</tab-item>
      <tab-item id="error">Error</tab-item>
    </tab-bar>
    <div class="message-list">
      <message
        v-for="(msg, index) in msgList"
        v-if="msg.type === activeType || activeType === 'all'"
        :key="index"
        :type="msg.type"
        :value="msg.value"
        :params="msg.params"
      />
    </div>
  </div>
</template>

<script>
import Message from './Message'
import {TabBar, TabItem} from '../components'
export default {
  components: {
    Message,
    TabItem,
    TabBar
  },
  data () {
    return {
      activeType: 'all',
      msgList: []
    }
  },
  // hook console 输出越早越好，选择最先被执行的 beforeCreate 周期方法进行 hook 操作
  beforeCreate () {
    const vm = this
    const originConsole = { }
    const names = ['log', 'info', 'error', 'warn', 'debug']
    names.forEach(name => {
      originConsole[name] = window.console[name]

      window.console[name] = function (...args) {
        vm.msgList.push({
          type: name,
          value: args[0],
          params: args.slice(1)
        })
        originConsole[name].apply(this, args)
      }
    })
  },
}
</script>

<style scoped>
.console-panel {
  padding: 5px 0;
  height: 100%;
  position: relative;
}

.navbar {
  height: 30px;
  display: flex;
  flex-direction: row;
}

.navbar .item {
  flex-grow: 1;
  text-align: center;
  line-height: 29px;
}

.navbar .item.selected {
  border-bottom: 1px solid #26a2ff;
}

/* .navbar .tab-item {
  padding: 0;
  margin-bottom: 0;
  border-bottom-width: 1px;
} */

.message-list {
  position: absolute;
  top: 38px;
  bottom: 0px;
  width: 100%;
  left: 0px;
  overflow-y: scroll;
}
</style>
