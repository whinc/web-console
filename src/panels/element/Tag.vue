<template>
  <!-- 不要换行，否则内容前后多出空白符 -->
  <span v-if="type === 'start'" class="tag tag--start" @click="$emit('click')">{{startTag}}</span>  
  <span v-else-if="type === 'end'" class="tag tag--end">{{endTag}}</span>  
  <span v-else-if="type === 'inline'" class="tag tag--inline" @click="$emit('click')">{{startTag}}<slot></slot>{{endTag}}</span>  
  <span v-else></span>  
</template>

<script>
export default {
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
.tag {
  &--start,
  &--end,
  &--inline {
    white-space: nowrap;
  }
}
</style>
