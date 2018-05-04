<template>
  <div class="container">
    <message
      v-for="(msg, index) in msgList"
      :key="index"
      :type="msg.type"
      :value="msg.value"
      :params="msg.params"
    />
  </div>
</template>

<script>
import Message from './Message'
export default {
  components: {
    Message
  },
  data () {
    return {
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
.container {
  padding: 5px;
}
</style>
