<template>
  <div class="text-block" @click.stop="isFold = !isFold">
    <!-- 当前键值对 -->
    <div class="prop">
      <!-- indentSize大于0，或者属性数量大于0，展示折叠展开符 -->
      <div v-if="indentSize > 0 || properties.length > 0" class="indent" :style="indentStyle">
        <div class="triangle" :class="arrowClass"></div>
      </div>
      <span v-if="hasName" :class="[nameType]">{{name}}</span>
      <span v-if="hasName" class="space">: </span>
      <span :class="valueClass">{{formattedValue}}</span>  
    </div>
    <!-- 子键值对 -->
    <div v-for="item in properties" :key="item.name" v-if="!isFold">
      <text-block
        :name="item.name"
        :nameType="item.nameType"
        :value="item.value"
        :indentSize="indentSize + 1"
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
    },
    indentSize: {
      type: Number,
      default: 1
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
    indentStyle () {
      return {
        width: this.indentSize > 0 ? `${this.indentSize}em` : 'auto' 
      }
    },
    // 折叠/展开箭头样式（使用CSS绘制）
    arrowClass () {
      return this.properties.length > 0 ? (this.isFold ? 'fold' : 'unfold') : ''
    },
    // 值的高亮样式
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
  .indent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-right: 3px;
  }
  .triangle {
    width: 0;
    height: 0;
    $border-width: 5px;
    /* 等边三角形，tan(30) 约为 0.5773502691896257 */
    &.fold {
      border-left: $border-width solid black;
      border-top: ($border-width * 0.5773502691896257) solid transparent;
      border-bottom: ($border-width * 0.5773502691896257) solid transparent;
    }
    &.unfold {
      border-top: $border-width solid black;
      border-left: ($border-width * 0.5773502691896257) solid transparent;
      border-right: ($border-width * 0.5773502691896257) solid transparent;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .prop {
    display: flex;
    flex-direction: row;
  }
  .space {
    white-space: pre;
  }
}
</style>
