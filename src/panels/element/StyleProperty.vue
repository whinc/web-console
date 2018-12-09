<template>
  <div class="style-property">
    <div class="style-property__item" @click="isExpand = !isExpand">
      <span class="style-property__name">{{name}}</span>
      <span>:</span>
      <span class="style-property__value" :class="[isExpandable ? (isExpand ? 'expand' : 'collapse') : '']">{{value}}</span>
      <span>;</span>
    </div>  
    <div v-if="isExpandable && isExpand" class="style-property__children">
      <StyleProperty v-for="prop in subProps" :key="prop.name"
        :name="prop.name"
        :value="prop.value"
      />
    </div>
  </div>
</template>

<script>
/**
 * 展示 CSS 属性的键值对，支持属性的缩写形式
 *
 * 非缩写形式属性：
 * {
 *  padding-left: 5px
 * }
 *
 * 缩写形式属性：
 * {
 *  padding: 5px;
 *    padding-top: 5px;
 *    padding-right: 5px;
 *    padding-bottom: 5px;
 *    padding-left: 5px;
 * }
 */
export default {
  name: "StyleProperty",
  props: {
    // CSS属性名
    name: String,
    // CSS属性值
    value: String,
    // 子属性
    subProps: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 展开/折叠属性
      isExpand: false
    };
  },
  computed: {
    // 是否可展开属性
    isExpandable() {
      return Array.isArray(this.subProps) && this.subProps.length > 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/triangle";

.style-property {
  display: flex;
  flex-direction: column;
  color: rgb(48, 57, 66);
  &__item {
    padding-left: 1.5em;
  }
  &__children {
    padding-left: 1em;
  }
  &__name {
    color: rgb(200, 0, 0);
  }

  &__value {
    padding-left: 0.5em;
    &.collapse::before {
      @include triangle-collapse(6px, #727272);
      margin-right: 0.2em;
    }
    &.expand::before {
      @include triangle-expand(6px, #727272);
      margin-right: 0.2em;
      margin-bottom: 1px;
    }
  }

  // 不可继承的属性
  &--not-inheritable {
  }
  // 被覆盖的属性
  &--overried {
  }
}
</style>
