<template>
  <span v-if="isObject">
    <span>{</span>
    <template v-if="deepth === 0">
      <span v-for="(name, index) in displayPropertyNames" :key="index">
        <span>{{name}}: </span>
        <text-inline-block :value="value[name]" :deepth="deepth + 1" />
        <span>, </span>
      </span>
    </template>
    <!-- 深度超过 1 层时，对象内容用省略号替代展示 -->
    <template v-else>
      <span>...</span>
    </template>
    <span>}</span>
  </span>
  <span v-else :class="valueClass">{{formattedValue}}</span>
</template>

<script>
/**
 * 高亮展示传入的值，如果是对象，在一行内展开
 * 
 * 例如，传入值为 obj
 * obj = {
 *  a: 1,
 *  b: 2
 * }
 * UI 展示成：
 * {a: 1, b: 2}
 * 
 * 观察 chrome devtools 的输出，有几个特点：
 * 1）最多展示 5 个字段，再多就展示省略号
 * obj = {
 *  a: 1,
 *  b: 2,
 *  c: 3,
 *  d: 4,
 *  e: 5,
 *  f: 6
 * }
 * {a: 1, b: 2, c: 3, d: 4, e: 5, ...}
 * 2）展示数据属性（包含可枚举和不可枚举），但不展示访问器属性
 * obj = {
 *  // 可枚举
 *  a: 1,
 *  // 不可枚举
 *  b: 1,
 *  // get 访问器
 *  c: (...)
 * }
 * {a: 1, b: 1}
 * 3）函数展示成 f（包含ES5函数和箭头函数）
 * obj = {
 *  a: () => {},
 *  b: function () {}
 * }
 * {a: f, b: f}
 */
import {
  isNull,
  isBoolean,
  isString,
  isNumber,
  isObject,
  isSymbol,
  isUndefined,
  flatMap,
  _console,
  isFunction
} from '@/utils'

export default {
  name: 'text-inline-block',
  props: {
    // 要展示的值，任意数据类型
    value: {},
    // 嵌套深度
    // let obj = {a: {b: 2}}
    // obj 的 deepth 为 0
    // obj.a 的 deepth 为 1
    // obj.a.b 的 deepth 为 2 以此类推
    deepth: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isObject () {
      return isObject(this.value)
    },
    displayPropertyNames () {
      const obj = this.value
      return Object.getOwnPropertyNames(obj)
        // 过滤出数据属性
        .filter(name => {
          const descriptor = Object.getOwnPropertyDescriptor(obj, name)
          return 'value' in descriptor
        })
        // 过滤出前 5 个
        .filter((v, i) => i < 5)
    },
    formattedValue () {
      const value = this.value
      if (isNull(value) || isUndefined(value)) {
        return String(value)
      }
      // 字符串展示在对象中时，需要引号包裹
      if (isString(value) && this.deepth > 0) {
        return JSON.stringify(value)
      }
      return value
    },
    valueClass () {
      const value = this.value
      return {
        null: isNull(value),
        undefined: isUndefined(value),
        boolean: isBoolean(value),
        number: isNumber(value),
        // 字符串仅当放到对象或数组中（即有key）时，需要高亮并带双引号显式
        string: isString(value) && this.deepth > 0,
        symbol: isSymbol(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.normal {
  color: black;
}
.null, .undefined {
  color: #808080;
}
.boolean {
  color: #0D22AA;
}
.number {
  color: #1C00CF;
}
.string {
  color: #C41A16;
}
.symbol {
  color: #C41A16
}
</style>
