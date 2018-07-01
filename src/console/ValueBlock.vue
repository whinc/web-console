<template>
  <span :class="valueClass">{{formattedValue}}</span>  
</template>

<script>
/**
 * 展示 JS 值，根据值类型自动着色，支持自定义 CSS 样式
 */
import {
  isNull,
  isBoolean,
  isString,
  isNumber,
  isPlainObject,
  isSymbol,
  isUndefined
} from '@/utils'

export default {
  props: {
    value: {
      required: true
    }
  },
  computed: {
    formattedValue () {
      const value = this.value
      if (isNull(value) || isUndefined(value)) {
        return String(value)
      } else {
        return value
      }
    },
    valueClass () {
      const value = this.value
      return {
        null: isNull(value),
        undefined: isUndefined(value),
        boolean: isBoolean(value),
        number: isNumber(value),
        string: isString(value),
        symbol: isSymbol(value)
      }
    }
  }
}
</script>

<style scoped>

/* 不同类型值的展示色彩 */
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
  color: black;
}
.symbol {
  color: #C41A16
}
</style>
