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
        v-if="msg.type === activeType || activeType === 'all'"
        :key="index"
        :type="msg.type"
        :value="msg.value"
        :params="msg.params"
      />
    </div>
    <tab-bar class="foot-bar">
      <my-button>Clear</my-button>
      <div class="col-line"></div>
      <my-button>Hide</my-button>
    </tab-bar>
  </div>
</template>

<script>
import Message from './Message'
import {TabBar, TabItem, MyButton} from '../components'
import {cloneDeep} from '../utils'
export default {
  components: {
    Message,
    MyButton,
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
        const _args = cloneDeep(args)
        vm.msgList.push({
          type: name,
          value: _args[0],
          params: _args.slice(1)
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

.foot-bar {
  position: absolute;
  height: 39px;
  bottom: 0px;
  line-height: 39px;
  border-top: 1px solid #d9d9d9;
}
.col-line {
  width: 1px;
  height: 80%;
  margin-top: auto;
  margin-bottom: auto;
  border-left: 1px solid #d9d9d9;
}
</style>
