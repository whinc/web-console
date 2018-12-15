<template>
  <span class="node-link" :class="{'selected': selected}" @click="$emit('click')">
    <template v-if="el.nodeType === Node.ELEMENT_NODE">
      <span class="node-link__tag-name">{{tagName}}</span>
      <template v-if="!compacted">
        <span v-if="el.id" class="node-link__id">{{id}}</span>
        <span v-if="el.classList.length > 0" class="node-link__class-name">{{className}}</span>
      </template>
    </template>
    <template v-else-if="el.nodeType === Node.TEXT_NODE">
      <span>(text)</span>
    </template>
    <template v-else-if="el.nodeType === Node.COMMENT_NODE">
      <span>&lt;!--&gt;</span>
    </template>
    <template v-else-if="el.nodeType === Node.DOCUMENT_TYPE_NODE">
      <span>&lt;!doctype&gt;</span>
    </template>
    <template v-else>
      <span>(unknow)</span>
    </template>
  </span>
</template>

<script>
/**
 * 元素节点链接，如 div#app.a.b
 */
export default {
  props: {
    el: {
      type: Node,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    compacted: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    Node() {
      return Node;
    },
    tagName() {
      return this.el.tagName.toLowerCase();
    },
    id() {
      return this.el.id ? "#" + this.el.id : "";
    },
    className() {
      return this.el.classList.length > 0 ? "." + [].slice.call(this.el.classList).join(".") : "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";
.node-link {
  height: 100%;
  line-height: 30px;
  white-space: nowrap;
  padding: 0 7px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // max-width: 20vw;
  &.selected {
    background-color: $toolbar-bg-color;
    span {
      color: $default-color !important;
    }
  }
  &__tag-name {
    color: $dom-tag-name-color;
  }
  &__id {
  }
  &__class-name {
    color: $dom-attribute-name-color;
  }
}
</style>
