<template>
  <div class="css-rule">
    <div class="css-rule__start">
      <span class="css-rule__selector" :class="{'css-rule__selector--style': isStyleAttribute}">{{selector}}</span>
      <span class="css-rule__left-brace">&nbsp;{</span>
      <span class="css-rule__href">{{rule.href}}</span>
    </div>
    <div class="css-rule__content">
      <StyleProperty v-for="prop in properties"
        :key="prop.name"
        :name="prop.name"
        :value="prop.value"
        :subProps="prop.subProps"
      />
    </div>
    <div class="css-rule__end">
      <span class="css-rule__right-brace">}</span>
    </div>
  </div>
</template>

<script>
import StyleProperty from "./StyleProperty";

// 支持缩写的 CSS 属性
const ABBR_PROPS = [
  "border",
  "border-top",
  "border-left",
  "border-right",
  "border-bottom",
  "border-image",
  "margin",
  "padding",
  "background",
  "animation",
  "flex",
  "font",
  "grid",
  "inset",
  "outline",
  "list-style",
  "text-decoration",
  "text-emphasis",
  "transform",
  "transition"
];

export default {
  components: {
    StyleProperty
  },
  props: {
    /*
    * {
    *  // 样式规则来源(styleAttribute, styleSheet)
    *  from: String
    *  // 选择器
    *  selector: String,
    *  // 是否是继承的
    *  inherit: Boolean,
    *  // 样式声明
    *  style: CSSStyleDeclaration,
    *  // 如果是导入或链入的样式表，该字段表示地址
    *  href: String
    * },
    */
    rule: {
      type: Object
    }
  },
  computed: {
    selector() {
      const rule = this.rule;
      if (rule.from === "styleSheet") {
        // 样式表
        return rule.selector;
      } else if (rule.from === "styleAttribute") {
        // 标签 style 属性
        return rule.inherit ? "Style Attribute" : "element.style";
      }
    },
    isStyleAttribute() {
      return this.rule.from === "styleAttribute";
    },
    /**
     * 将可缩写的 CSS 属性中缩写成一个属性，缩写后的属性多出一个 subProps 字段存储原始的属性集合
     *
     * 例如，将 CSSStyleDeclaration 进行处理后
     * {
     *  0: 'padding-left',
     *  1: 'padding-right',
     *  2: 'padding-top',
     *  3: 'padding-bottom',
     *  'padding-left': '5px',
     *  'padding-right': '5px',
     *  'padding-top': '5px',
     *  'padding-bottom': '5px',
     * }
     * 输出下面结果：
     * [
     *  {
     *    name: 'padding',
     *    value: '5px',
     *    subProps: [
     *      {name: 'padding-left', value: '5px'},
     *      {name: 'padding-right', value: '5px'},
     *      {name: 'padding-top', value: '5px'},
     *      {name: 'padding-bottom', value: '5px'},
     *    ]
     *  }
     * ]
     */
    properties() {
      const style = this.rule.style;
      const styleArr = [].slice.call(style);
      const properties = [];

      /**
       * i. 遍历所有可缩写的 CSS 属性，假设当前遍历的属性名为 abbr
       * ii. 如果元素属性列表中存在缩写属性 abbr，则创建一个对象 M 保存缩写属性 abbr 及其值，
       *     并将 abbr 展开后的所有属性键值对加入到 M.subProps 数组，将 M 加入到待返回数组中，
       *     最后移除元素样式列表中 abbr 展开后的所有属性
       * iii. 遍历结束后，将元素样式列表中值不为空的属性全部加入到待返回的属性列表
       */
      ABBR_PROPS.forEach(abbrName => {
        if (!style[abbrName]) return;

        // 存在缩写属性
        const prop = {
          name: abbrName,
          value: style[abbrName],
          subProps: []
        };
        const nameArr = styleArr.filter(name => name.indexOf(abbrName) !== -1);
        if (nameArr.length === 0) return;
        const subProps = nameArr.map(name => ({
          name,
          value: style[name],
          important: style.getPropertyPriority(name) === "important"
        }));
        prop.subProps.push(...subProps);
        // 移除已处理的属性
        nameArr.forEach(name => {
          styleArr.splice(styleArr.findIndex(v => v === name), 1);
        });
        properties.push(prop);
      });

      styleArr.forEach(name => {
        if (style[name]) {
          properties.push({
            name,
            value: style[name],
            important: style.getPropertyPriority(name) === "important"
          });
        }
      });

      return properties;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.css-rule {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $divider-color;
  padding: 2px 2px 4px 4px;

  &__start {
    display: flex;
    line-height: 1.5em;
  }
  &__content {
    display: flex;
    flex-direction: column;
  }
  &__end {
    line-height: 1.5em;
  }
  &__selector {
    flex: 0 0 auto;
    color: #222;
    &--style {
      color: #888;
    }
  }
  &__left-brace {
    flex: 1 1 auto;
  }
  &__href {
    flex: 0 0 auto;
    color: rgb(85, 85, 85);
  }
}
</style>
