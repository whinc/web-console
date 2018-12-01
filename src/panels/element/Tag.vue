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
  <span v-else-if="type === 'end'" class="tag tag--end" @click="$emit('click')">
    <span>&lt;</span>
    <span class="tag__tag-name">{{tagName}}</span>
    <span>&gt;</span>
  </span>  
  <span v-else-if="type === 'inline'" class="tag tag--inline" @click="$emit('click')">
    <Tag :el="el" type="start"/>
    <span class="tag__text"><slot></slot></span>
    <Tag :el="el" type="end"/>
  </span>  
  <span v-else></span>  
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
    startTag() {
      const el = this.el;
      if (el instanceof HTMLElement) {
        let attrList = [];
        attrList = el.getAttributeNames().map(name => `${name}="${el.getAttribute(name)}"`);
        return "<" + el.tagName.toLowerCase() + (attrList.length > 0 ? " " : "") + attrList.join(" ") + ">";
      } else if (el instanceof Comment) {
        return `<--`;
      } else {
        return "";
      }
    },
    endTag() {
      const el = this.el;
      if (el instanceof HTMLElement) {
        return "</" + el.tagName.toLowerCase() + ">";
      } else if (el instanceof Comment) {
        return `-->`;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";
$dom-tag-name-color: rgb(136, 18, 128);
$dom-attribute-name-color: rgb(153, 69, 0);
$dom-attribute-value-color: rgb(26, 26, 166);
$dom-link-color: rgb(17, 85, 204);
.tag {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: rgb(168, 148, 166);
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
