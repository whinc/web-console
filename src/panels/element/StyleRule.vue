<template>
  <div class="css-rule">
    <div class="css-rule__start">
      <span class="css-rule__selector" :class="{'css-rule__selector--style': isStyle}">{{selector}}</span>
      <span class="css-rule__left-brace">&nbsp;{</span>
      <span class="css-rule__href">{{rule.href}}</span>
    </div>
    <div class="css-rule__content">
      <StyleProperty v-for="prop in rule.properties"
        :key="prop.name"
        :name="prop.name"
        :value="prop.value"
      />
    </div>
    <div class="css-rule__end">
      <span class="css-rule__right-brace">}</span>
    </div>
  </div>
</template>

<script>
import StyleProperty from "./StyleProperty";

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
    *  // 声明块属性列表
    *  properties: [{
    *    name: String,
    *    value: String,
    *    important: Boolean
    *  }, ...],
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
    isStyle() {
      return this.rule.from === "styleAttribute";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";

.css-rule {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $divider-color;
  padding: 2px 2px 4px 4px;

  &__start {
    display: flex;
  }
  &__content {
    display: flex;
    flex-direction: column;
  }
  &__end {
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
