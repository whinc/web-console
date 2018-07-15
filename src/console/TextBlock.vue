<template>
  <div class="text-block" @click.stop="isFold = !isFold">
    <!-- 键值对 -->
    <div class="prop">
      <!-- 折叠展开符(指定的缩进量大于0，或者传入值是对象且属性数量大于0) -->
      <div v-if="indentSize > 0 || properties.length > 0" class="indent" :style="indentStyle">
        <div class="triangle" :class="arrowClass"></div>
      </div>
      <!-- 键 -->
      <template v-if="hasName">
        <span :class="[descriptor.enumerable ? 'public' : 'private']">{{name}}</span>
        <span class="space">: </span>
      </template>
      <!-- 值 -->
      <!-- get 访问器点击时才计算结果，而且只计算一次 -->
      <span v-if="isGetAccessor" @click="onClickGetAccessor">{{computedValue}}</span>
      <span v-else :class="valueClass">{{formattedValue}}</span>  
    </div>
    <!-- 子节点 -->
    <!-- 折叠展开使用 v-show 是为了保留组件内部状态 -->
    <div v-for="item in properties" :key="item.name" v-show="!isFold">
      <text-block
        :name="item.name"
        :descriptor="item.descriptor"
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
  isUndefined,
  _console
} from '@/utils'

/**
 * 树状展示传入值的结构
 * 
 * 使用示例：
 * // 展示值
 * <text-block :descriptor="{value: 1}" />
 * // 展示键和值
 * <text-block :name="age" :descriptor="{value: 1}" />
 */
export default {
  name: 'text-block',
  props: {
    // 属性名
    name: [String, Symbol],
    // 属性描述符，结构同 Object.defineProperty() 的第三个参数
    descriptor: {
      type: Object,
      required: true,
      validator: descriptor => {
        try {
          Object.defineProperty({}, 'key', descriptor)
        } catch (error) {
          _console.error(error.message, 'descriptor:', descriptor)
        }
        // ConsolePanel 内部组件不能再次抛出错误，否则会造成循环错误
        return true
      }
    },
    // 缩进数量
    indentSize: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // 是否折叠属性树
      isFold: true,
      // 当前 get 访问器是否已计算（仅当当前 descriptor 含 get 访问器时有效）
      hasComputed: false,
      // 当前 get 访问器计算结果（仅当当前 descriptor 含 get 访问器时有效）
      computedValue: '(...)'
    }
  },
  computed: {
    hasName () {
      return !!this.name
    },
    isGetAccessor () {
      return typeof this.descriptor.get === 'function'
    },
    // 当前对象的所有属性信息
    properties () {
      if (!isObject(this.descriptor.value)) {
        return []
      }
      const obj = this.descriptor.value
      // TODO: JSON.stringify 不能用于将循环引用的结构 JSON 化，需要进行特殊处理
      // 参考 https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json#
      const properties = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]
        .filter(name => name !== '__ob__')
        .map(name => {
          const descriptor = Object.getOwnPropertyDescriptor(obj, name)
          return { name, descriptor }
        })
      return properties
    },
    formattedValue () {
      const value = this.descriptor.value
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
      const value = this.descriptor.value
      return {
        null: isNull(value),
        undefined: isUndefined(value),
        boolean: isBoolean(value),
        number: isNumber(value),
        // 字符串仅当放到对象或数组中（即有key）时，需要高亮并带双引号显式
        string: isString(value) && this.hasName,
        symbol: isSymbol(value)
      }
    }
  },
  methods: {
    onClickGetAccessor () {
      if (!this.hasComputed) {  // 最多计算一次
        this.computedValue = this.descriptor.get()
        this.hasComputed = true
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
