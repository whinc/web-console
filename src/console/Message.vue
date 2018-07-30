<template>
  <div class="message source-code" :class="[type]">
    <div v-if="isErrorCaptured" class="error">
      Message 组件内部错误
    </div>
    <template v-else v-for="(argInfo, index) in argInfoList">
      <text-block
        :descriptor="{value: argInfo.displayValue}"
        :showValueDetail="argInfo.showValueDetail"
        :key="index + '1'"
      />
      <span v-if="index !== argInfoList.length - 1" class="space" :key="index + '2'">{{space}}</span>
    </template>
  </div>
</template>

<script>
import {isString, isNumber, isObject, isArray, cloneDeep, _console} from '@/utils'
import TextBlock from './TextBlock'

export default {
  components: {
    TextBlock
  },
  props: {
    msgId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
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
    argInfoList () {
      // 格式串和参数进行处理，返回一个数组，数组每个元素包含了占位符和对应的值
      let argInfoList = format(this.logArgs)
      // _console.log('formattedLogArgs', formattedLogArgs)

      // 将参数信息对象进一步处理，得到一些与 UI 展示相关的信息
      // 返回数据格式为
      // {value, placholder, displayValue, showValueDetail}
      const argInfoList2 = argInfoList.map(argInfo => {
        switch (argInfo.placeholder) {
          case '%%':
            argInfo.displayValue = '%'
            break
          case '%s':
            if (isArray(argInfo.value)) {
              argInfo.displayValue = `Array(${argInfo.value.length})`
            } else if (isObject(argInfo.value)) {
              argInfo.displayValue = 'Object'
            } else {
              argInfo.displayValue = String(argInfo.value)
            }
            break
          case '%i':  // 同下
          case '%d':
            argInfo.displayValue = String(parseInt(argInfo.value))
            break
          case '%f':
            argInfo.displayValue = String(parseFloat(argInfo.value))
            break
          case '%o':
            argInfo.displayValue = argInfo.value
            argInfo.showValueDetail = true
            break
          case '%O':
            argInfo.displayValue = argInfo.value
            argInfo.showValueDetail = false
            break
          default:
            argInfo.placeholder = ' ' // 没有placehodler的使用' '标记
            argInfo.displayValue = argInfo.value
            break
        }
        return argInfo
      })
      // _console.log('argInfoList2', cloneDeep(argInfoList2))

      // 合并相邻字符串，减少文本块的数量，避免文本块之间的默认空白符
      // {displayValue: 'a'} 和 {displayValue: 'b'} 将合并成一个 {displayValue: 'ab'}
      const argInfoList3 = []
      while(argInfoList2.length > 0) {
        const curArgInfo = argInfoList2.shift()
        if (argInfoList3.length === 0) {
          argInfoList3.push(curArgInfo)
        } else {
          const prevArgInfo = argInfoList3[argInfoList3.length - 1]
          if (isString(prevArgInfo.displayValue) && isString(curArgInfo.displayValue)) {
            prevArgInfo.displayValue += curArgInfo.displayValue
            prevArgInfo.placeholder += curArgInfo.placeholder
          } else {
            argInfoList3.push(curArgInfo)
          }
        }
      }
      // _console.log('argInfoList3', argInfoList3)
      return argInfoList3
    }
  },
  // 捕获 console API 引发的错误，避免陷入循环渲染
  errorCaptured (error) {
    // 在浏览器控制台输出错误原因
    _console.error(error)
    // UI 上展示出错提示
    this.isErrorCaptured = true
    return false
  },
}

/**
 * 格式化 console.log 参数列表，将占位符进行替换
 * 
 * 例如下面例子，将格式串按占位符进行分割，每个部分都用一个占位符描述对象表示
 * format(['a%sc%se', '1', '2', '3'])
 * // 返回一个占位符描述对象组成的数组，value 表示对应的值，placeholder 表示对应的占位符，如果不是占位符该
 * [
 *  {value: 'a'},
 *  {value: '1', placeholder: '%s'},
 *  {value: 'c'},
 *  {value: '2', placeholder: '%s'},
 *  {value: 'e'},
 *  {value: '3'},
 * ]
 * 
 * 算法步骤：
 * 对于 console.log 参数数组 ['a%sb%sc', '1', '2']
 * 1. 找到第一个参数中的第一个占位符，并以此将第一个参数分割成三部分：占位符之前部分('a'), 占位符('%s'), 占位符之后部分('b%sc')
 * 2. 出栈一个剩余参数替换占位符内容
 * 3. 将占位符之后的部分以及剩余参数再次进行第 1 步 的处理，直到没有剩余参数为止
 * @param {Array} logArgs 参数列表，第一个参数可以包含占位符
 * @param {Number} startPos 第一个参数中查找占位符的起始位置
 */
function format (logArgs) {
  if (!Array.isArray(logArgs)) {
    return [{value: logArgs}]
  }

  if (logArgs.length === 0) {
    return []
  }

  const [arg0, ...restArgs] = logArgs
  // 第一个参数非字符串，或没有剩余参数，不需要继续处理
  if (!isString(arg0) || restArgs.length === 0) {
    return logArgs.map(v => ({value: v}))
  }

  const matcher = /%%|%s|%o|%O|%i|%d|%f/
  // 从上次处理结束位置开始匹配
  const result = matcher.exec(arg0)
  if (!result) { // 没有占位符，不处理
    return logArgs.map(v => ({value: v}))
  }
  const placeholder = result[0]
  const placeholderIndex = result.index // 加上偏移量

  let part1 = null
  let part2 = null
  let part3 = null
  if (placeholderIndex > 0) {
    part1 = { value: arg0.substring(0, placeholderIndex) }
  }
  if (placeholder === '%%') {
    part2 = { value: '%', placeholder }
  } else {
    part2 = { value: restArgs.shift(), placeholder }
  }
  if (placeholderIndex + 2 <= arg0.length - 1) {
    part3 = { value: arg0.substring(placeholderIndex + 2) }
  }

  let formattedLogArgs = [] 
  if (part1) {
    formattedLogArgs.push(part1)
  }
  if (part2) {
    formattedLogArgs.push(part2)
  }
  if (part3) {
    formattedLogArgs.push(...format([part3.value, ...restArgs]))
  }

  return formattedLogArgs
}
</script>

<style scoped lang="scss">
.message {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 4px;
  overflow-y: scroll;
  &.log, &.debug, &.info {
    border-bottom: 1px solid rgb(240, 240, 240);
  }
  &.error {
    color: red;
    border-top: 1px solid hsl(0, 100%, 92%);
    border-bottom: 1px solid hsl(0, 100%, 92%);
    margin-top: -1px;
    background-color: hsl(0, 100%, 97%);
  }
  &.warn {
    color: hsl(39, 100%, 18%);
    border-top: 1px solid hsl(50, 100%, 88%);
    border-bottom: 1px solid hsl(50, 100%, 88%);
    margin-top: -1px;
    background-color: hsl(50, 100%, 95%);
  }
}

.space {
  white-space: pre;
}
</style>
