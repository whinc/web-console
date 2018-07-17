<template>
  <div class="text-block">
    <!-- 键值对 -->
    <div class="prop" @click.stop="isFold = !isFold">
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
    <div v-for="(item, index) in properties" :key="String(item.name) + index" v-show="!isFold">
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
  flatMap,
  _console,
isFunction
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
    // 当前对象的所有属性相关信息
    properties () {
      const value = this.isGetAccessor ? this.descriptor.get() : this.descriptor.value
      if (!isObject(value)) {
        return []
      }
      const obj = value

      // 获取属性名及其描述符
      const ownKeys = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]
      const properties = flatMap(ownKeys, (name) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, name)
        if (!descriptor) {
          return []
        }

        // value and writable 与 get/set 访问器不会同时存在
        if (isFunction(descriptor.get) && isFunction(descriptor.set)) { // 同时存在 getter 和 setter
          return [
            {name, descriptor},
            {
              name: `get ${name}`,
              descriptor: {
                value: descriptor.get,
                enumerable: false
              }
            },
            {
              name: `set ${name}`,
              descriptor: {
                value: descriptor.set,
                enumerable: false
              }
            }
          ]
        } else if (isFunction(descriptor.get) && !isFunction(descriptor.set)) { // 只存在 getter 
          return [
            {name, descriptor},
            {
              name: `get ${name}`,
              descriptor: {
                value: descriptor.get,
                enumerable: false
              }
            }
          ]
        } else if (!isFunction(descriptor.get) && isFunction(descriptor.set)) { // 只存在 setter
          return [
            {
              name: `set ${name}`,
              descriptor: {
                value: descriptor.set,
                enumerable: false
              }
            }
          ]
        } else { // 不存在 getter 或 setter，即 value 
          return [{name, descriptor }]
        }

        // _console.log(name, ':', descriptor)
      })
        // TODO: JSON.stringify 不能用于将循环引用的结构 JSON 化，需要进行特殊处理，暂且过滤掉存在循环引用的属性
        // 参考 https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json#
        // .filter(name => name !== '__ob__')
      
      // 增加展示'__proto__'属性
      if (properties.findIndex(v => v.name === '__proto__') === -1) {
        properties.push({
          name: '__proto__',
          descriptor: {
            value: obj.__proto__,
            enumerable: false,
            configurable: true
          }
        })
      }

      // Object.prototype 不展示'__proto__'属性，而是展示其 get/set 访问器，避免递归
      if (obj === Object.prototype) {
        let index = properties.findIndex(v => v.name === '__proto__')
        if (index !== -1) {
          properties.splice(index, 1)
          const descriptor = Object.getOwnPropertyDescriptor(obj, '__proto__')
          properties.push({
            name: 'get __proto__',
            descriptor: {
              value: descriptor.get,
              enumerable: false
            }
          }, {
            name: 'set __proto__',
            descriptor: {
              value: descriptor.set,
              enumerable: false
            }
          })
        }
      }

      // 属性排序
      return properties.sort(propCompareFn)
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

/**
 * 获取属性的展示优先级
 * 先按类别划分优先级高低，相同优先级内部再根据字母顺序排序
 * A public         // 0
 * B public         // 
 * a public         // 
 * b public         // 
 * Symbol() public  // 10
 * Symbol(a) public // 
 * A private        // 20
 * B private        // 
 * a private        // 
 * b private        // 
 * Symbol() private // 30
 * get A            // 40
 * set A            // 
 * get B
 * get a            // 
 * set a            // 
 * get b
 * __proto__        // 100
 */
function getPropDisplayPriority (prop) {
  let priority = 0
  if (isString(prop.name)) {
    if (prop.descriptor.enumerable) {
      priority = 0
    } else {
      if (prop.name.indexOf('get ') === 0 || prop.name.indexOf('set ') === 0) {
        priority = 40
      } else {
        priority = 20
      }
    }
  } else {  // symbol
    if (prop.descriptor.enumerable) {
      priority = 10
    } else {
      priority = 30
    }
  }
  if (prop.name === '__proto__') {
    priority = 100
  }
  return priority
}

/**
 * 属性排序比较函数
 */
function propCompareFn (propA, propB) {
  let priorityA = getPropDisplayPriority(propA)
  let priorityB = getPropDisplayPriority(propB)
  // _console.log(propA.name, propB.name, priorityA, priorityB)
  if (priorityA === priorityB) { // 优先级相同时按字母的 ASCII 码排序，码值越小越靠上
    const a = String(propA.name)
    const b = String(propB.name)
    return a < b ? -1 : (a > b ? 1 : 0)
  } else { // 否则，优先级越低越靠上
    return priorityA - priorityB
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
