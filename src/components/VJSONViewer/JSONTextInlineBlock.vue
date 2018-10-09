<template>
  <!-- 数组类型 -->
  <span v-if="isArray">
    <span>[</span>
    <span v-for="(v, i) in value" :key="i">
      <JSONTextInlineBlock
        :name="String(i)"
        :value="v"
        :deepth="deepth + 1"
      />
      <span v-if="i !== value.length - 1">,&nbsp;</span>
    </span>
    <span>]</span>
  </span>
  <!-- 对象 -->
  <span v-else-if="isObject">
    <!-- 展示对象详情 -->
    <span>{</span>
    <!-- 第1层属性要展示且最多展示 5 个，超过 5 个后使用省略号替代 -->
    <template v-if="deepth === 0">
      <span v-for="(propName, index) in displayPropertyNames" :key="index" v-if="index < maxDisplayPropertyCount">
        <span>{{propName}}: </span>
        <JSONTextInlineBlock
          :name="propName"
          :value="value[propName]"
          :deepth="deepth + 1"
        />
        <span v-if="index !== Math.min(maxDisplayPropertyCount - 1, displayPropertyNames.length - 1)">, </span>
      </span>
      <span v-if="displayPropertyNames.length >= 5">, ...</span>
    </template>
    <!-- 超过1层的属性用省略号替代展示 -->
    <span v-else>...</span>
    <span>}</span>
  </span>
  <!-- 字符串类型 -->
  <span v-else-if="isString">
    <template v-if="name">
      <span class="string-quote">"</span>
      <span :class="{'string': isRoot}">{{value}}</span>
      <span class="string-quote">"</span>
    </template>
    <template v-else>
      <span>{{value}}</span>
    </template>
  </span>
  <!-- 其他类型 -->
  <span v-else :class="isRoot ? valueClass : ''">{{formattedValue}}</span>
</template>

<script>
/**
 * 以一行内展示传入的 JSON 对象
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
  isArray
} from "@/utils";

export default {
  name: "JSONTextInlineBlock",
  props: {
    // 属性名
    // 属性名为空时，表示内联块作为根元素展示
    // 属性名有值时，表示内敛块作为对象的属性值展示
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
    }
  },
  computed: {
    isRoot() {
      return this.deepth === 0;
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
    maxDisplayPropertyCount() {
      return 5;
    },
    displayPropertyNames() {
      if (isObject(this.value)) {
        return Object.keys(this.value);
      } else {
        return [];
      }
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
        // 字符串仅当放到对象或数组中（即有key）时，需要高亮并带双引号显式
        string: isString(value),
        symbol: isSymbol(value)
      };
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
