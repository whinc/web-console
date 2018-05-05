<template>
  <div class="console-panel">
    <tab-bar v-model="activeType" class="navbar">
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
    <tab-bar class="toolbar">
      <tab-item>
        <button class="item" @click="onClickClear">Clear</button>
      </tab-item>
      <tab-item>
        <button class="item" @click="onClickHide">Hide</button>
      </tab-item>
    </tab-bar>
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
  methods: {
    onClickClear () {
      this.msgList = []
    },
    onClickHide () {
      this.$root.$emit('hide')
    }
  }
}
</script>

<style scoped>
.console-panel {
  height: 100%;
  position: relative;
}

.navbar {
}

.navbar .item.selected {
  border-bottom: 1px solid #26a2ff;
}

.message-list {
  position: absolute;
  top: 30px;
  bottom: 39px;
  width: 100%;
  left: 0px;
  overflow-y: scroll;
}

.toolbar {
  position: absolute;
  height: 39px;
  bottom: 0px;
  line-height: 39px;
  border-top: 1px solid #d9d9d9;
}
.toolbar .item {
    width: 100%;
    height: 100%;
    background-color: white;
    outline: none;
    border: none;
    position: relative;
}
.toolbar .item:active {
  background-color: rgba(0,0,0,.15);
}
.toolbar .item::after{
    content: " ";
    position: absolute;
    top: .53846154em;
    bottom: .53846154em;
    right: 0;
    border-right: 1px solid #d9d9d9;
}
</style>
