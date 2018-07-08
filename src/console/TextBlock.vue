<template>
  <div class="text-block" @click.stop="isFold = !isFold">
    <div>
      <span v-if="hasName" :class="[nameType]">{{name}}</span>
      <span v-if="hasName">:</span>
      <span :class="valueClass">{{formattedValue}}</span>  
    </div>
    <div v-for="item in properties" :key="item.name" v-if="!isFold" class="prop">
      <div class="indent"></div>
      <text-block
        :name="item.name"
        :nameType="item.nameType"
        :value="item.value"
      />
    </div>
  </div>
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
  isObject,
  isSymbol,
  isUndefined
} from '@/utils'

export default {
  name: 'text-block',
  props: {
    value: {
      required: true
    },
    name: {
      type: String
    },
    nameType: {
      type: String,
      validator: (value) => {
        return ['public', 'private'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      isFold: true
    }
  },
  computed: {
    hasName () {
      return !!this.name
    },
    properties () {
      if (!isObject(this.value)) {
        return []
      }
      const obj = this.value
      // TODO: JSON.stringify 不能用于将循环引用的结构 JSON 化，需要进行特殊处理
      // 参考 https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json#
      const properties = Object.getOwnPropertyNames(obj)
      .filter(name => name !== '__ob__')
      .map(name => {
        return {
          name,
          nameType: 'public',
          value: obj[name]
        }
      })
      return properties
    },
    formattedValue () {
      const value = this.value
      if (isNull(value) || isUndefined(value)) {
        return String(value)
      }
      // 字符串展示在对象中时，需要引号包裹
      if (isString(value) && this.hasName) {
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
        // 字符串直接输出到控制台是默认的黑色，如果放到对象或数组中（即有key）时，需要高亮并带双引号
        string: isString(value) && this.hasName,
        symbol: isSymbol(value)
      }
    }
  }
}
</script>

<style scoped lang="scss">

.text-block {
  display: flex;
  flex-direction: column;
  /* 不同类型值的展示色彩 */
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

  .public {
    color: #881391;
  }
  .private {
    color: #B871BD;
  }
  .prop {
    display: flex;
    flex-direction: row;
  }
  .indent {
    width: 1em;
  }
}
</style>
