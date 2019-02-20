<template>
  <!-- 函数 -->
  <span v-if="isFunction" class="text-inline-block function-type">
    <template v-if="deepth === 0">
      <span v-if="isArrowFunction">{{value}}</span>
      <span v-else>
        <span class="function">ƒ</span><span> {{value.name}}()</span>
      </span>
    </template>
    <template v-else>
      <span class="function">ƒ</span>
    </template>
  </span>
  <!-- 数组类型 -->
  <!-- 两种展示 -->
  <!-- [1, 2, 3] 数组作为根元素时，即 deepth 为 0 时 -->
  <!-- Array(3) 数组作为嵌套元素或者由外部控制时，即 deepth 大于 0 或 showValueDetail 为 false，如 {a: 1, b: Array(3)}, [1, Array(3)] -->
  <span v-else-if="isArray" class="text-inline-block array-type">
    <template v-if="showValueDetail">
      <template v-if="deepth === 0">
        <span style="color: gray">({{value.length}})&nbsp;</span>
        <span>[</span>
        <!-- 数组可能包含非数字下标，使用 Object.keys 过滤出有效的 keys 进行处理 -->
        <span v-for="(key, i) in Object.keys(value)" :key="i" v-if="i < MAX_DISPLAY_PROP_COUNT">
          <text-inline-block
            :name="String(key)"
            :value="short(value[key])"
            :deepth="deepth + 1"
          />
          <span v-if="i < Math.min(MAX_DISPLAY_PROP_COUNT - 1, displayPropertyNames.length - 1)">, </span>
        </span>
        <span v-if="displayPropertyNames.length >= 5">, ...</span>
        <span>]</span>
      </template>
      <span v-else>Array({{value.length}})</span>
    </template>
    <span v-else>Array({{value.length}})</span>
  </span>
  <!-- 对象 -->
  <!-- 三种展示-->
  <!-- '{a: 1, b: 2}' 当对象作为根元素时，即 deepth 为 0 -->
  <!-- '{...}' 当对象作为嵌套元素时，即 deepth 大于 0，如 {a: 1, b: {...}} -->
  <!-- 'Object' 有外部开关控制，即 showValueDetail 为 true，如 {a: 1, __proto__: Object}  -->
  <span v-else-if="isObject" class="text-inline-block object-type">
    <!-- 展示对象详情 -->
    <template v-if="showValueDetail">
      <span>{</span>
      <!-- 第1层属性要展示且最多展示 5 个，超过 5 个后使用省略号替代 -->
      <template v-if="deepth === 0">
        <span v-for="(propName, index) in displayPropertyNames" :key="index" v-if="index < MAX_DISPLAY_PROP_COUNT">
          <span>{{propName}}: </span>
          <text-inline-block
            :name="propName"
            :value="short(value[propName])"
            :deepth="deepth + 1"
          />
          <span v-if="index < Math.min(MAX_DISPLAY_PROP_COUNT - 1, displayPropertyNames.length - 1)">, </span>
        </span>
        <span v-if="displayPropertyNames.length >= 5">, ...</span>
      </template>
      <!-- 超过1层的属性用省略号替代展示 -->
      <span v-else>...</span>
      <span>}</span>
    </template>
    <!-- 展示对象类型 -->
    <span v-else>Object</span>
  </span>
  <!-- 字符串类型 -->
  <span v-else-if="isString" class="text-inline-block string-type">
    <template v-if="name">
      <span class="string-quote">"</span>
      <span class="string keep-format">{{value}}</span>
      <span class="string-quote">"</span>
    </template>
    <template v-else>
      <span class="keep-format">{{value}}</span>
    </template>
  </span>
  <!-- 其他类型 -->
  <span v-else class="text-inline-block" :class="valueClass">{{formattedValue}}</span>
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
 * UI 展示：
 * {a: 1, b: 2, c: 3, d: 4, e: 5, ...}
 *
 * 2）展示数据属性（包含可枚举和不可枚举），但不展示访问器属性
 * obj = {
 *  // 可枚举
 *  a: 1,
 *  // 不可枚举
 *  b: 1,
 *  // get 访问器
 *  c: (...)
 * }
 * UI 展示：
 * {a: 1, b: 1}
 *
 * 3）函数深度为 0 时展示成 ƒ，深度大于 0 时展示函数的字符串
 * obj = {
 *  a: () => {},
 *  b: function () {},
 *  c: function say () {}
 * }
 * 深度为 0 时展示：
 * {a: ƒ, b: ƒ, c: ƒ}
 * 深度大于 0 时展示：
 * {
 *  a: () => {}
 *  b: ƒ (),
 *  c: ƒ say()
 * }
 */
import { isNull, isBoolean, isString, isNumber, isObject, isSymbol, isUndefined, isArray, isFunction } from "@/utils";

export default {
  name: "text-inline-block",
  props: {
    // 属性名
    // 属性名为空时，表示内联块作为根元素，展示传入的 value 值，即 <TextInlineBlock/>
    // 属性名有值时，表示内联块作为对象的属性值，展示 value 值，即 {key: <TextInlineBlock/>}
    name: [String, Symbol],
    // 属性值
    value: {},
    // 嵌套深度
    // let obj = {a: {b: 2}}
    // obj 的 deepth 为 0
    // obj.a 的 deepth 为 1
    // obj.a.b 的 deepth 为 2 以此类推
    deepth: {
      type: Number,
      default: 0
    },
    // 是否显示对象详情
    // 为 true 时，显式对象的属性字段信息，例如 {a: 1}, [1, 2] 等
    // 为 false 时，则仅对象的类型，例如 Object, Array 等
    showValueDetail: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isFunction() {
      return isFunction(this.value);
    },
    isArrowFunction() {
      return isFunction(this.value) && String(this.value).indexOf("() =>") === 0;
    },
    isArray() {
      return isArray(this.value);
    },
    isString() {
      return isString(this.value);
    },
    isObject() {
      return isObject(this.value);
    },
    MAX_DISPLAY_PROP_COUNT() {
      return 5;
    },
    displayPropertyNames() {
      const obj = this.value;
      return (
        Object.getOwnPropertyNames(obj)
          // 过滤出数据属性
          .filter(name => {
            const descriptor = Object.getOwnPropertyDescriptor(obj, name);
            return "value" in descriptor;
          })
      );
    },
    formattedValue() {
      const value = this.value;
      if (isNull(value) || isUndefined(value)) {
        return String(value);
      }
      return value;
    },
    valueClass() {
      const value = this.value;
      return {
        null: isNull(value),
        undefined: isUndefined(value),
        boolean: isBoolean(value),
        number: isNumber(value),
        symbol: isSymbol(value)
      };
    }
  },
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    logger.error(error);
    return false;
  },
  methods: {
    short(value) {
      const maxLen = 24;
      if (isString(value) && value.length > maxLen) {
        return value.slice(0, maxLen / 2) + "..." + value.slice(value.length - maxLen / 2);
      }

      return value;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-inline-block {
  word-break: break-all;

  .normal {
    color: #565656;
  }
  .null,
  .undefined {
    color: rgb(128, 128, 128);
  }
  .boolean,
  .function {
    color: rgb(13, 34, 170);
  }
  .number {
    color: #1c00cf;
  }
  .string,
  .symbol {
    color: rgb(196, 26, 22);
  }
  .string-quote {
    color: #222;
  }
  .keep-format {
    white-space: pre-wrap;
  }
}
</style>
