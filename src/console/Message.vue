<template>
  <div class="message" :class="[type]">
    <div v-if="isErrorCaptured" class="error">
      Message 组件内部错误
    </div>
    <template v-else v-for="(value, index) in values">
      <value-block :value="value" :key="index + '1'" />
      <span v-if="index !== values.length - 1" class="keep-white" :key="index + '2'">{{space}}</span>
    </template>
  </div>
</template>

<script>
import ValueBlock from './ValueBlock'

export default {
  components: {
    ValueBlock
  },
  props: {
    type: {
      type: String,
      default: 'log'
    },
    logArgs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isErrorCaptured: false
    }
  },
  computed: {
    space () {
      return ' '
    },
    values () {
      return this.logArgs
    }
  },
  // 捕获 console API 引发的错误，避免陷入循环渲染
  errorCaptured (error) {
    // 在浏览器控制台输出错误原因
    this.$root.console.error(error)
    // UI 上展示出错提示
    this.isErrorCaptured = true
    return false
  },
}
</script>

<style scoped>
.message {
  min-height: 30px;
  padding: 0 4px;
  border-bottom: 1px solid;
  overflow-y: scroll;
  /* display: flex;
  flex-direction: row; */
  align-items: center;
}

.log, .debug, .info {
  color: #000;
  border-color: #FFF;
  background-color: #FFF;
}

.error {
  color: #dc143c;
  border-color: #f4a0ab;
  background-color: #ffe4e1;
}

/* .info {
  color: #6a5acd;
  border-color: #FFF;
  background-color: #FFF;
} */

.warn {
  color: orange;
  border-color: #ffb930;
  background-color: #fffacd;
}

/* .debug {
  color: #daa520;
  border-color: #FFF;
  background-color: #FFF;
} */

.keep-white {
  white-space: pre;
}
</style>
