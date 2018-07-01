<template>
  <div class="console-panel">
    <tab-bar v-model="activeType" class="head-bar">
      <tab-item id="all">
        <span class="item">All</span>
      </tab-item>
      <tab-item id="log">
        <span class="item">Log</span>
      </tab-item>
      <tab-item id="info">
        <span class="item">Info</span>
      </tab-item>
      <tab-item id="warn">
        <span class="item">Warn</span>
      </tab-item>
      <tab-item id="error">
        <span class="item">Error</span>
      </tab-item>
    </tab-bar>
    <div class="message-list">
      <message
        v-for="(msg, index) in msgList"
        :key="index"
        v-if="msg.type === activeType || activeType === 'all'"
        :type="msg.type"
        :log-args="msg.logArgs"
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
import Message from './Message'
import {TabBar, TabItem, MyButton, MyFootBar, MyFootSeparator} from '@/components'
import {cloneDeep} from '@/utils'

export default {
  components: {
    Message,
    MyButton,
    MyFootSeparator,
    TabItem,
    TabBar,
    MyFootBar
  },
  data () {
    return {
      activeType: 'all',
      /**
       * [{
       *  // 日志类型，取值 all/log/info/error/warn/debug
       *  type: String,
       *  // log 的参数数组
       *  logArgs: Array
       * }]
       */
      msgList: []
    }
  },
  // hook console 输出越早越好，选择最先被执行的 beforeCreate 周期方法进行 hook 操作
  beforeCreate () {
    const vm = this
    const originConsole = { }
    const names = ['log', 'info', 'error', 'warn', 'debug']
    const root = this.$root
    names.forEach(name => {
      originConsole[name] = window.console[name]

      window.console[name] = function (...args) {
        if (!root.disableHookConsole) {
          vm.msgList.push({
            type: name,
            logArgs: cloneDeep(args)
          })
        }
        originConsole[name].apply(this, args)
      }
    })

    this.$root.console = originConsole
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

.head-bar {
}

.head-bar .item {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.head-bar .item.selected {
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
</style>
