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
import {isString, isNumber} from '@/utils'
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
      let formattedArgs = format(this.logArgs)
      return formattedArgs
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

/**
 * 格式化 console.log 参数，将占位符进行替换
 * 例如：
 * console.log('a%sc%se', 'b', 'd') // 输出：abcde
 * 'a%sc%se'
 * 1) 将第一个参数拆分成三部分：'a', '%s', 'c%se'，剩余参数为: 'b', 'd'
 * 2) 将第一个参数拆分的三部分中间的占位符进行替换得到：'a', 'b', 'c%se'，消耗一个剩余参数，剩余参数更新为：'d'
 * 3) 将拆分的三部分进行合并（如有必要）得到：'abc%se'，剩余参数不变
 * 4) 将得到的参数和剩余参数再按照上面步骤处理，直到找不到占位符
 * @param {Array} logArgs 参数列表，第一个参数可以包含占位符
 * @param {Number} startPos 第一个参数中查找占位符的起始位置
 */
window.format = function format (logArgs, startPos = 0) {
  if (!Array.isArray(logArgs)) {
    return logArgs
  }

  if (logArgs.length === 0) {
    return []
  }

  const [arg0, ...restArgs] = logArgs
  // 第一个参数非字符串，或没有剩余参数，不需要继续处理
  if (!isString(arg0) || restArgs.length === 0) {
    return logArgs
  }

  const matcher = /(%%|%s|%o|%O|%i|%d|%f)/
  // 从上次处理结束位置开始匹配
  const result = matcher.exec(arg0.substring(startPos))
  if (!result) { // 没有占位符，不处理
    return logArgs
  }
  const placeholder = result[0]
  const placeholderIndex = startPos + result.index // 加上偏移量
  const formattedLogArgs = []
  let part1 = placeholderIndex > 0 ? arg0.substring(0, placeholderIndex) : ''
  let part2 = placeholder
  let part3 = arg0.substring(placeholderIndex + 2)
  if (restArgs.length > 0) {
    if (placeholder === '%%') {
      part2 = '%'
    } else {
      const value = restArgs.shift()
      if (placeholder === '%s') {
        part2 = String(value)
      } else if (placeholder === '%i' || placeholder === '%d') {
        if (isNumber(value)) {
          part2 = parseInt(value, 10)
        } else {
          part2 = NaN
        }
      } else if (placeholder === '%f') {
        if (isNumber(value)) {
          part2 = parseFloat(value, 10)
        } else {
          part2 = NaN
        }
      } else {
        part2 = value
      }
    }
  }

  const nextPos = (part1 + part2).length
  formattedLogArgs.push(...format([part1 + part2 + part3, ...restArgs], nextPos))
  return formattedLogArgs
}

</script>

<style scoped lang="scss">
.message {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 30px;
  padding: 0 4px;
  border-bottom: 1px solid;
  overflow-y: scroll;
  &.log, &.debug, &.info {
    color: #000;
    border-bottom-color: #F0F0F0;
    background-color: #FFF;
  }
  &.error {
    color: #dc143c;
    border-color: #f4a0ab;
    background-color: #ffe4e1;
  }
  &.warn {
    color: orange;
    border-color: #ffb930;
    background-color: #fffacd;
  }
}

.keep-white {
  white-space: pre;
}
</style>
