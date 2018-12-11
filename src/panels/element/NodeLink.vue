<template>
  <span class="node-link" :class="{'selected': selected}" @click="$emit('click')">
    <template v-if="el.nodeType === Node.ELEMENT_NODE">
      <span class="node-link__tag-name">{{tagName}}</span>
      <span v-if="el.id" class="node-link__id">{{id}}</span>
      <span v-if="el.classList.length > 0" class="node-link__class-name">{{className}}</span>
    </template>
    <template v-else-if="el.nodeType === Node.TEXT_NODE">
      <span>(text)</span>
    </template>
    <template v-else-if="el.nodeType === Node.COMMENT_NODE">
      <span>&lt;!--&gt;</span>
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
.node-link {
  white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // max-width: 20vw;
  &.selected {
    background-color: red;
  }
  &__tag-name {
    color: rgb(136, 18, 128);
  }
  &__id {
  }
  &__class-name {
    color: rgb(153, 69, 0);
  }
}
</style>
