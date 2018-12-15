<template>
  <div class="message source-code" :class="[message.type]">
    <div v-if="showTimestamps" class="timestamps">{{formattedTime}}</div>
    <div v-if="isErrorCaptured" class="error">
      Message 组件内部错误
    </div>
    <template v-else v-for="(argInfo, index) in argInfoList">
      <text-block
        :descriptor="{value: argInfo.displayValue}"
        :showRootValueDetail="argInfo.showValueDetail"
        :key="index + '1'"
      />
      <span v-if="index !== argInfoList.length - 1" class="space" :key="index + '2'">{{space}}</span>
    </template>
  </div>
</template>

<script>
import { isString, isObject, isArray, Logger } from "@/utils";
import TextBlock from "./TextBlock";

const logger = new Logger("[Message]");
export default {
  components: {
    TextBlock
  },
  props: {
    /**
     * 日志消息
     * {
     *  // 唯一编号
     *  id: String,
     *  // 日志类型 'log', 'info', 'error', 'warn', 'debug'
     *  type: String,
     *  // 时间戳
     *  timestamps: Number,
     *  // 日志接口参数列表
     *  logArgs: Array
     * }
     */
    message: {
      type: Object,
      required: true
    },
    /**
     * 显示时间戳
     */
    showTimestamps: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isErrorCaptured: false
    };
  },
  computed: {
    space() {
      return " ";
    },
    formattedTime() {
      let date = new Date(this.message.timestamps);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const millisconeds = date.getMilliseconds();
      return (
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds) +
        "." +
        (millisconeds < 10 ? "00" + millisconeds : millisconeds < 100 ? "0" + millisconeds : millisconeds)
      );
    },
    /**
     * console 日志接口参数处理后的参数信息列表
     *
     * @returns {Array<Object>} 返回数组，数组元素数据结构如下
     * {
     *  value,            // 原始值
     *  placholder,       // 占位符
     *  displayValue,     // 展示值
     *  showValueDetail   // 是否展开细节
     * }
     *
     * 例如 console.log('a%sc%s', 'b', {}) 执行，logArgs 接收到 ['a%sc%s', 'b', {}]，argInfoList 返回
     * [
     *  {value: 'a', displayValue: 'a', placeholder: ''}
     *  {value: 'b', displayValue: 'b', placeholder: '%s'}
     *  {value: 'c', displayValue: 'c', placeholder: ''}
     *  {value: {}, displayValue: 'Object', placeholder: '%s'}
     * ]
     * 观察发现：
     * 1）存在占位符时，value 和 displayValue 可能不同，取决于希望如何展示
     * 2）没有占位符时，value 和 displayValue 必然相同
     */
    argInfoList() {
      // 对 log 参数进行格式化，将占位符替换成对应值
      let argInfoList = format(this.message.logArgs);
      // logger.log('formattedLogArgs', formattedLogArgs)

      // 将参数信息对象进一步处理，得到一些与 UI 展示相关的信息
      // 返回数据格式为
      // {value, placholder, displayValue, showValueDetail}
      const argInfoList2 = argInfoList.map(argInfo => {
        switch (argInfo.placeholder) {
          case "%%":
            argInfo.displayValue = "%";
            break;
          case "%s":
            if (isArray(argInfo.value)) {
              argInfo.displayValue = `Array(${argInfo.value.length})`;
            } else if (isObject(argInfo.value)) {
              argInfo.displayValue = "Object";
            } else {
              argInfo.displayValue = String(argInfo.value);
            }
            break;
          case "%i": // 同下
          case "%d":
            argInfo.displayValue = String(parseInt(argInfo.value));
            break;
          case "%f":
            argInfo.displayValue = String(parseFloat(argInfo.value));
            break;
          case "%o":
            argInfo.displayValue = argInfo.value;
            argInfo.showValueDetail = true;
            break;
          case "%O":
            argInfo.displayValue = argInfo.value;
            argInfo.showValueDetail = false;
            break;
          case "%c":
            // %c 暂时不支持，不显示
            argInfo.displayValue = "";
            break;
          default:
            argInfo.placeholder = " "; // 没有placehodler的使用' '标记
            argInfo.displayValue = argInfo.value;
            break;
        }

        // Error 对象和普通对象不同，它不展示对象内部属性结构，而是展示堆栈信息
        if (argInfo.displayValue instanceof Error) {
          const err = argInfo.displayValue;
          argInfo.displayValue = (err.stack || err).toString();
        }

        return argInfo;
      });
      // logger.log('argInfoList2', cloneDeep(argInfoList2))

      // 合并相邻字符串，减少文本块的数量，避免文本块之间的默认空白符
      // {displayValue: 'a'} 和 {displayValue: 'b'} 将合并成一个 {displayValue: 'ab'}
      const argInfoList3 = [];
      while (argInfoList2.length > 0) {
        const curArgInfo = argInfoList2.shift();
        if (argInfoList3.length === 0) {
          argInfoList3.push(curArgInfo);
        } else {
          const prevArgInfo = argInfoList3[argInfoList3.length - 1];
          if (isString(prevArgInfo.displayValue) && isString(curArgInfo.displayValue)) {
            prevArgInfo.displayValue += curArgInfo.displayValue;
            prevArgInfo.placeholder += curArgInfo.placeholder;
          } else {
            argInfoList3.push(curArgInfo);
          }
        }
      }
      // logger.log('argInfoList3', argInfoList3)
      return argInfoList3;
    }
  },
  // 捕获 console API 引发的错误，避免陷入循环渲染
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    logger.error(error);
    // UI 上展示出错提示
    this.isErrorCaptured = true;
    return false;
  }
};

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
function format(logArgs) {
  if (!Array.isArray(logArgs)) {
    return [{ value: logArgs }];
  }

  if (logArgs.length === 0) {
    return [];
  }

  const [arg0, ...restArgs] = logArgs;
  // 第一个参数非字符串，或没有剩余参数，不需要继续处理
  if (!isString(arg0) || restArgs.length === 0) {
    return logArgs.map(v => ({ value: v }));
  }

  const matcher = /%%|%s|%o|%O|%i|%d|%f|%c/;
  // 从上次处理结束位置开始匹配
  const result = matcher.exec(arg0);
  if (!result) {
    // 没有占位符，不处理
    return logArgs.map(v => ({ value: v }));
  }
  const placeholder = result[0];
  const placeholderIndex = result.index; // 加上偏移量

  let part1 = null;
  let part2 = null;
  let part3 = null;
  if (placeholderIndex > 0) {
    part1 = { value: arg0.substring(0, placeholderIndex) };
  }
  if (placeholder === "%%") {
    part2 = { value: "%", placeholder };
  } else {
    part2 = { value: restArgs.shift(), placeholder };
  }
  if (placeholderIndex + 2 <= arg0.length - 1) {
    part3 = { value: arg0.substring(placeholderIndex + 2) };
  }

  let formattedLogArgs = [];
  if (part1) {
    formattedLogArgs.push(part1);
  }
  if (part2) {
    formattedLogArgs.push(part2);
  }
  if (part3) {
    formattedLogArgs.push(...format([part3.value, ...restArgs]));
  }

  return formattedLogArgs;
}
</script>

<style scoped lang="scss">
@import "../../styles/mixin";
.message {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 4px;
  overflow-y: hidden;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &.log,
  &.debug,
  &.info {
    border-bottom: 1px solid rgb(240, 240, 240);
  }
  &.error {
    @include descendant-color(red);
    border-top: 1px solid hsl(0, 100%, 92%);
    border-bottom: 1px solid hsl(0, 100%, 92%);
    margin-top: -1px;
    background-color: hsl(0, 100%, 97%);
  }
  &.warn {
    @include descendant-color(hsl(39, 100%, 18%));
    border-top: 1px solid hsl(50, 100%, 88%);
    border-bottom: 1px solid hsl(50, 100%, 88%);
    margin-top: -1px;
    background-color: hsl(50, 100%, 95%);
  }

  .timestamps {
    color: gray;
    margin-right: 5px;
    line-height: 20px;
  }
}

.space {
  white-space: pre;
}
</style>
