<template>
  <!-- 不要换行，否则内容前后多出空白符 -->
  <span v-if="type === 'start'" class="tag tag--start" @click="$emit('click')">
    <span>&lt;</span>
    <span class="tag__tag-name">{{tagName}}</span>
    <span v-for="[name, value] in attrs" :key="name">
      <span>&nbsp;</span>
      <span class="tag__attr-name">{{name}}</span>
      <span>="</span>
      <span class="tag__attr-value">{{value}}</span>
      <span>"</span>
    </span>
    <span>&gt;</span>
  </span>
  <span v-else-if="type === 'end' && !isVoidElement" class="tag tag--end" @click="$emit('click')">
    <span>&lt;/</span>
    <span class="tag__tag-name">{{tagName}}</span>
    <span>&gt;</span>
  </span>
  <span v-else-if="type === 'inline'" class="tag tag--inline" @click="$emit('click')">
    <Tag :el="el" type="start"/>
    <span class="tag__text" v-if="hasDefaultSlot">
      <slot></slot>
    </span>
    <Tag :el="el" type="end"/>
  </span>
</template>

<script>
export default {
  name: "Tag",
  props: {
    el: {
      type: Element,
      required: true
    },
    type: {
      type: String,
      default: "start",
      validator(value) {
        return ["start", "end", "inline"].indexOf(value) !== -1;
      }
    }
  },
  computed: {
    tagName() {
      return this.el.tagName.toLowerCase();
    },
    attrs() {
      const el = this.el;
      return el.getAttributeNames().map(name => [name, el.getAttribute(name)]);
    },
    hasDefaultSlot() {
      const arr = this.$slots.default;
      if (Array.isArray(arr) && arr.length > 0) {
        return Boolean(arr[0].text);
      } else {
        return false;
      }
    },
    // 是否是无内容标签
    // 无内容标签不能有结束标签，HTML5 中定义的无内容标签见<https://html.spec.whatwg.org/multipage/syntax.html#void-elements>
    isVoidElement() {
      return (
        [
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "link",
          "meta",
          "param",
          "source",
          "track",
          "wbr"
        ].indexOf(this.tagName) !== -1
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variable";
@import "../../styles/mixin";
.tag {
  @include descendant-color(rgb(168, 148, 166));
  white-space: pre-wrap;
  word-break: break-all;
  &--start,
  &--end,
  &--inline {
  }
  &__tag-name {
    color: $dom-tag-name-color;
  }
  &__attr-name {
    color: $dom-attribute-name-color;
  }
  &__attr-value {
    color: $dom-attribute-value-color;
  }
  &__text {
    color: rgb(48, 57, 66);
    white-space: pre;
  }
}
</style>
