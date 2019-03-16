<template>
  <div v-if="isMatched" class="message source-code g-hide-scrollbar" :class="[message.type]">
    <div v-if="showTimestamps" class="timestamps">{{formattedTime}}</div>

    <template v-if="!isErrorCaptured">
      <span v-for="(argInfo, index) in argInfoList" :key="index" class="block-wrapper">
        <text-block
          :descriptor="{value: argInfo.displayValue}"
          :showRootValueDetail="argInfo.showValueDetail"
          :key="index + '1'"
          :style="argInfo.style"
          style="padding-right: 0.5em"
        />
      </span>
    </template>
    <div v-else class="error">
      Message 组件内部错误
    </div>
  </div>
</template>

<script>
import { isString, isObject, isArray, Logger, isFunction } from "@/utils";
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
    // 是否显示时间戳
    showTimestamps: {
      type: Boolean,
      default: false
    },
    // 过滤器
    filter: {
      type: String,
      default: ""
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
    argInfoList() {
      // 对 log 参数进行格式化，将占位符替换成对应值
      let argInfoList = parseLogArgs(this.message.logArgs);
      // logger.log('formattedLogArgs', formattedLogArgs)

      // 将参数信息对象进一步处理，得到一些与 UI 展示相关的信息
      // 返回数据格式为
      // {value, placholder, displayValue, showValueDetail}
      argInfoList = formatLogArgsForDisplay(argInfoList);

      return argInfoList;
    },
    // 是否匹配过滤器
    isMatched() {
      return !this.filter || this.argInfoList.some(value => match(value.displayValue, this.filter));
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
 * 如果 value 包含 filter 所表示的关键字，则返回 true，否则返回 false
 * @param {any} value 内容
 * @param {String} filter 过滤关键字
 * @param {Number} deepth 匹配深度
 * @returns {boolean}
 */
function match(value, filter, deepth = Infinity) {
  if (deepth < 0) return false;

  if (isArray(value)) {
    return value.some(el => match(el, filter, deepth - 1));
  } else if (isObject(value)) {
    return Object.keys(value).some(key => match(key, filter, deepth - 1) || match(value[key], filter, deepth - 1));
  } else if (isFunction(value)) {
    return value.name.indexOf(filter) !== -1;
  } else {
    return String(value).indexOf(filter) !== -1;
  }
}

/**
 * 解析日志方法接收到的的参数列表，返回包含占位符描述对象的数组
 *
 * console.log 方法接收的第一个参数如果是字符串，可以通过特殊占位符来格式化输出结果。
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
 * 2. 出栈剩余参数替换占位符内容
 * 3. 将占位符之后的部分以及剩余参数再次进行第 1 步 的处理，直到没有剩余参数为止
 *
 * @param {Array} logArgs 参数列表，第一个参数可以包含占位符
 * @param {Number} startPos 第一个参数中查找占位符的起始位置
 * @returns {Array<Object>} 返回包含占位符描述对象的数组
 */
function parseLogArgs(logArgs) {
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
    formattedLogArgs.push(...parseLogArgs([part3.value, ...restArgs]));
  }

  return formattedLogArgs;
}

/**
 * 格式化日志参数描述对象列表，增加控制显示的相关标志位
 *
 * 例如同样是 '%s' 占位符，数值和对象的展示是不一样的。再例如 Error 对象和非 Error 对象展示的内容是不同的，
 * 前者展示堆栈信息，后者展示对象的属性树。该函数就是为了处理这种有不同展示需求的情况。
 *
 * {
 *  value,            // 原始值
 *  placholder,       // 占位符
 *  displayValue,     // 展示值
 *  showValueDetail,  // 是否展开细节
 *  style             // 样式
 * }
 *
 * 例如 console.log('a%sc%s', 'b', {}) 的参数列表解析后如下：
 * [
 *  {value: 'a'}
 *  {value: 'b', placeholder: '%s'}
 *  {value: 'c'}
 *  {value: {}, placeholder: '%s'}
 * ]
 * 将上面描述对象数组进一步处理得到（还有一个合并相邻字符串的处理，此处省略）：
 * [
 *  {value: 'a', displayValue: 'a', placeholder: ''}
 *  {value: 'b', displayValue: 'b', placeholder: '%s'}
 *  {value: 'c', displayValue: 'c', placeholder: ''}
 *  {value: {}, displayValue: 'Object', placeholder: '%s'}
 * ]
 *
 * 观察发现：
 * 1）存在占位符时，value 和 displayValue 可能不同，取决于希望如何展示
 * 2）没有占位符时，value 和 displayValue 必然相同
 *
 * @returns {Array<Object>} 返回包含占位符描述对象的数组
 */
function formatLogArgsForDisplay(argInfoList) {
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
        // %c 占位符对应的样式作用于其后开始的第一个元素直至下一个 %c 占位符或结束位置之前中间的所有元素（%O 和 %o 除外）
        // 举例：console.log('%c A B %c C', 'color: red', 'color: blue')  // A B 是 red， C 是 blue
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

  // 合并相邻字符串（%c 占位符除外），减少文本块的数量，避免文本块之间的默认空白符
  // 例如 {displayValue: 'a'} 和 {displayValue: 'b'} 将合并成一个 {displayValue: 'ab'}
  const argInfoList3 = [];
  while (argInfoList2.length > 0) {
    const curArgInfo = argInfoList2.shift();
    if (argInfoList3.length === 0) {
      argInfoList3.push(curArgInfo);
    } else {
      const prevArgInfo = argInfoList3[argInfoList3.length - 1];
      if (
        isString(prevArgInfo.displayValue) &&
        isString(curArgInfo.displayValue) &&
        prevArgInfo.placeholder !== "%c" &&
        curArgInfo.placeholder !== "%c"
      ) {
        prevArgInfo.displayValue += curArgInfo.displayValue;
        prevArgInfo.placeholder += curArgInfo.placeholder;
      } else {
        argInfoList3.push(curArgInfo);
      }
    }
  }
  // logger.log('argInfoList3', cloneDeep(argInfoList3))

  // 处理 %c 占位符样式，将 %c 的样式复制到其后元素，直至遇到下一个 %c 或格式串结尾才终止
  let lastStyle = "";
  argInfoList3.forEach(argInfo => {
    if (argInfo.placeholder === "%c") {
      lastStyle = argInfo.value;
    } else {
      if (lastStyle && !/%O|%o/.test(argInfo.placeholder)) {
        argInfo.style = lastStyle;
      }
    }
  });
  const argInfoList4 = argInfoList3.filter(argInfo => argInfo.placeholder !== "%c");
  // logger.log('argInfoList4', cloneDeep(argInfoList4))

  return argInfoList4;
}
</script>

<style scoped lang="scss">
@import "../../styles/mixins";
.message {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 4px;
  overflow-y: hidden;
  overflow-x: auto;
  &.log,
  &.debug,
  &.info {
    border-bottom: 1px solid rgb(240, 240, 240);
  }
  &.error {
    @include descendant-attr("color", red);
    border-top: 1px solid hsl(0, 100%, 92%);
    border-bottom: 1px solid hsl(0, 100%, 92%);
    margin-top: -1px;
    background-color: hsl(0, 100%, 97%);
  }
  &.warn {
    @include descendant-attr("color", hsl(39, 100%, 18%));
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
  .block-wrapper {
    display: inline-flex;
    flex-direction: row;
    align-items: flex-start;
  }
}

.space {
  white-space: pre;
}
</style>
