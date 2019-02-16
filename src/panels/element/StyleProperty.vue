<template>
  <div class="style-property">
    <div class="style-property__item" @click="isExpand = !isExpand">
      <!-- 属性名可空，为空时不展示 -->
      <span class="style-property__name">{{name}}</span>
      <span>:</span>
      <!-- 属性值，如果是缩写属性，属性值前面有三角形箭头 -->
      <span class="style-property__value" :class="[isExpandable ? (isExpand ? 'expand' : 'collapse') : '']">
        <!-- 如属性值中包含颜色值，会被分隔成三部分，中间部分是可展示的颜色值 -->
        <template v-if="colorValueList.length > 1">
          <span>{{colorValueList[0]}}</span>
          <StyleColorValue :color="colorValueList[1]" />
          <span>{{colorValueList[2]}}</span>
        </template>
        <span v-else>{{value}}</span>
      </span>
      <span>;</span>
    </div>
    <!-- 属性展开形式，如 padding 展开后 padding-left/padding-right/padding-top/padding-bottom -->
    <div v-if="isExpandable && isExpand" class="style-property__children">
      <StyleProperty
        v-for="prop in subProps"
        :key="prop.name"
        :name="prop.name"
        :value="prop.value"
      />
    </div>
  </div>
</template>

<script>
import { Style } from "@/utils";
import StyleColorValue from "./StyleColorValue";
/**
 * 展示 CSS 属性的键值对，支持属性的缩写形式，支持颜色值特殊展示
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
  components: {
    StyleColorValue
  },
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
    },
    // 根据颜色值在属性值中的位置，将属性值分成一个数组，数组元素之间间隔一个颜色块
    colorValueList() {
      const value = this.value;
      const colorRegExp = Style.getColorRegExp();
      if (colorRegExp.test(value)) {
        const matchResult = colorRegExp.exec(value);
        const colorIndex = matchResult.index;
        const color = matchResult[0];
        return [value.slice(0, colorIndex), color, value.slice(colorIndex + color.length)];
      } else {
        return [value];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/triangles";

.style-property {
  display: flex;
  flex-direction: column;
  color: rgb(48, 57, 66);
  &__item {
    padding-left: 1.5em;
    line-height: 1.4em;
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
      @include triangles-collapse(6px, #727272);
      margin-right: 0.2em;
    }
    &.expand::before {
      @include triangles-expand(6px, #727272);
      margin-right: 0.2em;
      margin-bottom: 1px;
    }
  }

  &__color {
    display: inline-block;
    vertical-align: middle;
    width: 1em;
    height: 1em;
    margin-right: 3px;
    border: 1px solid rgba(128, 128, 128, 0.6);
  }

  // 不可继承的属性
  &--not-inheritable {
  }
  // 被覆盖的属性
  &--overried {
  }
}
</style>
