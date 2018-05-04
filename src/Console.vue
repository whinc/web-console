<template>
  <div class="container">
    <div v-for="(msg, index) in msgList" :key="index">{{msg}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msgList: []
    }
  },
  // hook console 输出越早越好，选择最先被执行的 beforeCreate 周期方法进行 hook 操作
  beforeCreate () {
    const vm = this
    const originConsole = {}
    const names = ['log', 'info', 'error', 'warn', 'debug', 'clear']
    names.forEach(name => {
      originConsole[name] = window.console[name]

      window.console[name] = function (...args) {
        vm.msgList.push(args.join(' '))
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
