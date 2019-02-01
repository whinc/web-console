<template>
  <div class="text-block">
    <!-- name/value -->
    <!-- @click.stop 避免事件冒泡到上一级 TextBlock -->
    <div class="prop" @click.stop="isFold = !isFold">
      <!-- 折叠展开符仅当缩进量大于0，或者传入值是对象且属性数量大于0时可见-->
      <div v-if="deepth > 0 || properties.length > 0" class="indent" :style="indentStyle">
        <div class="triangle" :class="arrowClass"></div>
      </div>
      <!-- 属性名 -->
      <template v-if="hasName">
        <span class="key" :class="[descriptor.enumerable ? 'public' : 'private']">{{displayName}}</span>
        <span class="space">: </span>
      </template>
      <!-- 属性值 -->
      <!-- getter 访问器点击时才计算结果，而且只计算一次，且计算结果值始终不展示详情 -->
      <template v-if="isGetAccessor">
        <text-inline-block
          v-if="hasComputed"
          :name="name"
          :value="computedValue"
          :showValueDetail="false"
        />
        <span v-else @click.stop="onClickGetAccessor">(...)</span>
      </template>
      <!-- value 则直接展示 -->
      <!-- showValueDetail 说明：-->
      <!-- a)如果是根元素，则由 showRootValueDetail 决定是否显示详情 -->
      <!-- b)否则，如果是非'__proto__'属性且处于折叠态时，也显示详情 -->
      <!-- c)其他情形不展示详情 -->
      <!-- 如果是根元素, 并且是对象类型, 则展示详情页时以斜体展示 -->
      <text-inline-block
        v-else
        :name="name"
        :value="descriptor.value"
        :showValueDetail="isRoot ? showRootValueDetail : (name !== '__proto__' && isFold)"
        :class="textInlineBlockStyle"
      />
    </div>
    <!-- 子节点 -->
    <div v-for="(item, index) in properties" :key="String(item.name) + index" v-if="!isFold">
      <text-block
        :name="item.name"
        :descriptor="item.descriptor"
        :needComputeProps="!isFold"
        :deepth="deepth + 1"
      />
    </div>
  </div>
</template>

<script>
/**
 * 高亮显示传入值，如果值是对象，以树状结构展示，可以折叠展开
 *
 * 例如，传入值为 obj
 * obj = {
 *  a: 1,
 *  b: 2
 * }
 * UI 展示成：
 * {
 *  a: 1,
 *  b: 2
 * }
 *
 * 观察 chrome devtools 的输出，有几个特点：
 * 1）...
 *
 * 使用示例：
 * // 展示值
 * <text-block :descriptor="{value: 1}" />
 * // 展示键和值
 * <text-block :name="age" :descriptor="{value: 1}" />
 */
import { isString, isObject, flatMap, Logger, isFunction } from "@/utils";
import TextInlineBlock from "./TextInlineBlock";

const logger = new Logger("[TextBlock]");
export default {
  name: "text-block",
  components: {
    TextInlineBlock
  },
  props: {
    // 属性描述符，结构同 Object.defineProperty() 的第三个参数
    descriptor: {
      type: Object,
      required: true,
      validator: descriptor => {
        try {
          Object.defineProperty({}, "key", descriptor);
        } catch (error) {
          logger.error(error.message, "descriptor:", descriptor);
        }
        // ConsolePanel 内部组件不能再次抛出错误，否则会造成循环错误
        return true;
      }
    },
    // 属性名（可选）
    name: [String, Symbol],
    // 是否需要立即计算对象属性信息
    needComputeProps: {
      type: Boolean,
      default: true
    },
    // 嵌套深度
    // obj = {a: 1, b: {c: 2}}
    // obj 深度为 0
    // obj.b 深度为 1
    // obj.b.c 深度为 2
    deepth: {
      type: Number,
      default: 0
    },
    // 根节点是否展示值的详情（仅对根元素有效，对子元素无效）
    // 为 true 时，对象展示成 {...}，数组展示成 [...]
    // 位 false 时，对象展示成 Object，数组展示成 Array(n)
    showRootValueDetail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否折叠属性树
      isFold: true,
      // 当前 get 访问器是否已计算（仅当当前 descriptor 含 get 访问器时有效）
      hasComputed: false,
      // 当前 get 访问器计算结果（仅当当前 descriptor 含 get 访问器时有效）
      computedValue: "(...)"
    };
  },
  computed: {
    isRoot() {
      return !this.name;
    },
    hasName() {
      return !!this.name;
    },
    /**
     * 对象 key 的展示值
     * 考虑 key 为 Symbol 类型或包含特殊字符（如空白符）时的处理
     */
    displayName() {
      let _name = String(this.name);
      if (_name.indexOf(" ") === 0) {
        return '"' + _name.replace(/^\s+/, " ") + '"';
      } else {
        return _name;
      }
    },
    isGetAccessor() {
      return typeof this.descriptor.get === "function";
    },
    // 当前对象的所有属性相关信息
    properties() {
      const defaultReturns = [];

      // 如不需要计算属性可直接返回以提高性能
      if (!this.needComputeProps) {
        return defaultReturns;
      }

      // 获取对象值
      // 如果是值属性，取 value 值；如果是 getter 访问器，取计算值
      let value;
      if (this.isGetAccessor) {
        if (this.hasComputed) {
          value = this.computedValue;
        } else {
          return defaultReturns;
        }
      } else {
        value = this.descriptor.value;
      }

      let obj;
      if (isObject(value)) {
        obj = value;
      } else if (isFunction(value)) {
        obj = value;
      } else {
        return defaultReturns;
      }

      // 获取属性名及其描述符
      const ownKeys = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
      const properties = flatMap(ownKeys, name => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, name);
        if (!descriptor) {
          return [];
        }

        // value and writable 与 get/set 访问器不会同时存在
        if (isFunction(descriptor.get) && isFunction(descriptor.set)) {
          // 同时存在 getter 和 setter
          return [
            { name, descriptor },
            {
              // Symbol 类型需要进行转换
              name: `get ${String(name)}`,
              descriptor: {
                value: descriptor.get,
                enumerable: false
              }
            },
            {
              name: `set ${String(name)}`,
              descriptor: {
                value: descriptor.set,
                enumerable: false
              }
            }
          ];
        } else if (isFunction(descriptor.get) && !isFunction(descriptor.set)) {
          // 只存在 getter
          return [
            { name, descriptor },
            {
              name: `get ${String(name)}`,
              descriptor: {
                value: descriptor.get,
                enumerable: false
              }
            }
          ];
        } else if (!isFunction(descriptor.get) && isFunction(descriptor.set)) {
          // 只存在 setter
          return [
            {
              name: `set ${String(name)}`,
              descriptor: {
                value: descriptor.set,
                enumerable: false
              }
            }
          ];
        } else {
          // 不存在 getter 或 setter，那就是数据访问器了
          return [{ name, descriptor }];
        }

        // logger.log(name, ':', descriptor)
      });
      // TODO: JSON.stringify 不能用于将循环引用的结构 JSON 化，需要进行特殊处理，暂且过滤掉存在循环引用的属性
      // 参考 https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json#
      // .filter(name => name !== '__ob__')

      // 增加展示'__proto__'属性
      if (properties.findIndex(v => v.name === "__proto__") === -1) {
        properties.push({
          name: "__proto__",
          descriptor: {
            value: obj.__proto__,
            enumerable: false,
            configurable: true
          }
        });
      }

      // Object.prototype 不展示'__proto__'属性，而是展示其 get/set 访问器，避免递归
      if (obj === Object.prototype) {
        let index = properties.findIndex(v => v.name === "__proto__");
        if (index !== -1) {
          properties.splice(index, 1);
          const descriptor = Object.getOwnPropertyDescriptor(obj, "__proto__");
          properties.push(
            {
              name: "get __proto__",
              descriptor: {
                value: descriptor.get,
                enumerable: false
              }
            },
            {
              name: "set __proto__",
              descriptor: {
                value: descriptor.set,
                enumerable: false
              }
            }
          );
        }
      }

      // 属性排序
      return properties.sort(propCompareFn);
    },
    indentStyle() {
      return {
        width: this.deepth > 0 ? `${this.deepth}em` : "auto"
      };
    },
    // 折叠/展开箭头样式（使用CSS绘制）
    arrowClass() {
      return this.properties.length > 0 ? (this.isFold ? "fold" : "unfold") : "";
    },
    textInlineBlockStyle() {
      // 是根节点，且是对象，且需要显示详情时，以斜体展示
      const b1 = this.isRoot && this.showRootValueDetail && isObject(this.descriptor.value);
      // 函数类型，以斜体展示
      const b2 = isFunction(this.descriptor.value);
      return {
        italic: b1 || b2
        // 只有根节点需要换行展示，非根节点不换行方便阅读
      };
    }
  },
  methods: {
    onClickGetAccessor() {
      if (!this.hasComputed) {
        // 最多计算一次
        this.hasComputed = true;
        try {
          // 冻结计算结果，避免 Vue 添加额外属性
          this.computedValue = Object.freeze(this.descriptor.get());
        } catch (error) {
          logger.error(error);
          this.computedValue = "(error: " + error.message + ")";
        }
      }
    }
  }
};

/**
 * 获取属性的展示优先级
 * 先按类别划分优先级高低，相同优先级内部再根据字母顺序排序
 * public 属性
 * A          // 0
 * B
 * a
 * b
 * Symbol()   // 10
 * Symbol(a)
 * _A        // 15
 * _B
 *
 * private 属性
 * A         // 20
 * B
 * a
 * b
 * Symbol()  // 30
 * Symbol(a)
 * _A       // 35
 * _B
 * get A     // 40
 * set A
 * get B
 * get a
 * set a
 * get b
 * __proto__ // 100
 */
function getPropDisplayPriority(prop) {
  let priority = 0;
  if (isString(prop.name)) {
    if (prop.descriptor.enumerable) {
      if (prop.name.indexOf("_") === 0) {
        priority = 15;
      } else {
        priority = 0;
      }
    } else {
      if (prop.name.indexOf("get ") === 0 || prop.name.indexOf("set ") === 0) {
        priority = 40;
      } else if (prop.name.indexOf("_") === 0) {
        priority = 35;
      } else {
        priority = 20;
      }
    }
  } else {
    // symbol
    if (prop.descriptor.enumerable) {
      priority = 10;
    } else {
      priority = 30;
    }
  }
  if (prop.name === "__proto__") {
    priority = 100;
  }
  return priority;
}

/**
 * 属性排序比较函数
 */
function propCompareFn(propA, propB) {
  let priorityA = getPropDisplayPriority(propA);
  let priorityB = getPropDisplayPriority(propB);
  // logger.log(propA.name, propB.name, priorityA, priorityB)
  if (priorityA === priorityB) {
    // 优先级相同时按字母的 ASCII 码排序，码值越小越靠上
    // 默认比较字母的 ASCII
    let a = String(propA.name);
    let b = String(propB.name);
    if (!isNaN(parseFloat(a)) && !isNaN(parseFloat(b))) {
      // a, b 都是数字时，比较数值大小
      a = parseFloat(a);
      b = parseFloat(b);
    }
    return a < b ? -1 : a > b ? 1 : 0;
  } else {
    // 否则，优先级越低越靠上
    return priorityA - priorityB;
  }
}
</script>

<style scoped lang="scss">
.public,
.private {
  color: rgb(136, 19, 145);
}
.private {
  opacity: 0.6;
}

.text-block {
  display: flex;
  flex-direction: column;
  line-height: 1.4em;
  .indent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-right: 3px;
    flex-shrink: 0;
  }
  .triangle {
    width: 0;
    height: 0;
    $border-width: 5px;
    /* 等边三角形，tan(30) 约为 0.5773502691896257 */
    &.fold {
      border-left: $border-width solid #727272;
      border-top: $border-width * 0.8 solid transparent;
      border-bottom: $border-width * 0.8 solid transparent;
    }
    &.unfold {
      border-top: $border-width solid #727272;
      border-left: $border-width * 0.8 solid transparent;
      border-right: $border-width * 0.8 solid transparent;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .prop {
    display: flex;
    flex-direction: row;
    .key {
      flex-shrink: 0;
    }
  }
  .space {
    white-space: pre;
    flex-shrink: 0;
  }

  .italic {
    font-style: italic;
  }
}
</style>
