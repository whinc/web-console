<template>
  <div class="json-text-block">
    <!-- name/value -->
    <!-- @click.stop 避免事件冒泡到上一级 TextBlock -->
    <div class="prop" @click.stop="isFold = !isFold">
      <!-- 折叠展开符仅当缩进量大于0，或者传入值是对象且属性数量大于0时可见-->
      <div v-if="deepth > 0 || properties.length > 0" class="indent" :style="indentStyle">
        <div class="triangles" :class="arrowClass"></div>
      </div>
      <!-- 属性名 -->
      <template v-if="hasName">
        <span class="key public">{{name}}</span>
        <span class="space">: </span>
      </template>
      <!-- 属性值 -->
      <JSONTextInlineBlock
        :name="name"
        :value="descriptor.value"
        class="nowrap"
      />
    </div>
    <!-- 子节点 -->
    <div v-for="(item, index) in properties" :key="String(item.name) + index" v-if="!isFold">
      <JSONTextBlock
        :name="item.name"
        :descriptor="item.descriptor"
        :deepth="deepth + 1"
      />
    </div>
  </div>
</template>

<script>
/**
 * 以树状结构展示传入的 JSON 对象
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
 * 使用示例：
 * // 展示值
 * <text-block :descriptor="{value: 1}" />
 * // 展示键和值
 * <text-block :name="age" :descriptor="{value: 1}" />
 */
import { isObject, flatMap, Logger, isFunction } from "@/utils";
import JSONTextInlineBlock from "./JSONTextInlineBlock";

const logger = new Logger("[JSONTextBlock]");
export default {
  name: "JSONTextBlock",
  components: {
    JSONTextInlineBlock
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
    // 嵌套深度
    // obj = {a: 1, b: {c: 2}}
    // obj 深度为 0
    // obj.b 深度为 1
    // obj.b.c 深度为 2
    deepth: {
      type: Number,
      default: 0
    },
    // 初始状态下展开
    initialUnfold: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否折叠属性树
      isFold: true
    };
  },
  computed: {
    isRoot() {
      return !this.name;
    },
    hasName() {
      return !!this.name;
    },
    // 当前对象的所有属性相关信息
    properties() {
      // 获取对象值
      // 如果是值属性，取 value 值；如果是 getter 访问器，取计算值
      let value = this.descriptor.value;

      let obj;
      if (isObject(value)) {
        obj = value;
      } else {
        return [];
      }

      // 获取属性名及其描述符
      const ownKeys = Object.keys(obj);
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
          // 不存在 getter 或 setter，即 value
          return [{ name, descriptor }];
        }
      });

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
    }
  },
  mounted() {
    this.isFold = !this.initialUnfold;
  },
  methods: {}
};

/**
 * 属性排序比较函数
 */
function propCompareFn(propA, propB) {
  const a = String(propA.name);
  const b = String(propB.name);
  return a < b ? -1 : a > b ? 1 : 0;
}
</script>

<style scoped lang="scss">
.json-text-block {
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
  .triangles {
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
      &.public {
        color: rgb(136, 19, 145);
      }
    }
  }
  .space {
    white-space: pre;
    flex-shrink: 0;
  }

  .italic {
    font-style: italic;
  }
  .nowrap {
    white-space: nowrap;
  }
}
</style>
