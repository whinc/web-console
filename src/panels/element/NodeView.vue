<template>
  <div v-if="el && el.nodeType === Node.ELEMENT_NODE" class="node element" @click.stop="toggleFold">
    <template v-if="childNodes.length > 1 || (childNodes.length === 1 && childNodes[0].nodeType !== Node.TEXT_NODE)">
      <!-- 展开 -->
      <template v-if="!isFold">
        <Tag :el="el" type="start" :style="indentStyle" />
        <NodeView v-for="(node, index) in childNodes" :key="deepth + '-' + index"
          :el="node"
          :deepth="deepth + 1"
        />
        <Tag :el="el" type="end" :style="indentStyle" />
      </template>
      <!-- 折叠 -->
      <template v-else>
        <Tag :el="el" type="inline" :style="indentStyle">...</Tag>
      </template>
    </template>
    <template v-else>
      <Tag :el="el" type="inline" :style="indentStyle">{{el.textContent}}</Tag>
    </template>
  </div>  
  <div v-else-if="el && el.nodeType === Node.TEXT_NODE"
    class="node text"
    :style="indentStyle"
    >
    "{{el.data}}"
  </div>
  <div v-else-if="el && el.nodeType === Node.COMMENT_NODE"
    class="node comment"
    :style="indentStyle"
    >
    {{`<--${el.data}-->`}}
  </div>
  <div v-else
    class="node"
    :style="indentStyle"
    >
    {{`<${el.nodeName}>`}}
  </div>
</template>

<script>
import Tag from "./Tag";
/**
 * DOM 树
 * 节点类型
 *
 *
 * 子节点的展示
 * 1)如果父节点只有一个子节点，且子节点为 Text 类型，则内联展示子节点，且 Text 内容不需要双引号包裹
 * <div>hello</div>
 * 2)否则，每个子节点独占一行展示
 * <div>
 *   "hello"
 *   <!-- comment -->
 * </div>
 */
export default {
  name: "NodeView",
  components: {
    Tag
  },
  props: {
    el: {
      type: Node,
      default: null
    },
    deepth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 是否折叠
      isFold: false
    };
  },
  computed: {
    Node() {
      return Node;
    },
    indentStyle() {
      return {
        "padding-left": this.deepth > 0 ? `${this.deepth}em` : "auto"
      };
    },
    childNodes() {
      const arr = [];
      if (!this.el) return arr;

      const len = this.el.childNodes.length;
      for (let i = 0; i < len; ++i) {
        const node = this.el.childNodes[i];
        // Node.childNodes 是动态变化的，取值时需要判空
        if (node) {
          const isEmptyTextNode = /^\s+$/.test(node.data);
          // 过滤掉空白字符组成的 Text 节点
          if (node.nodeType !== Node.TEXT_NODE || !isEmptyTextNode) {
            arr.push(node);
          }
        }
      }
      return arr;
    }
  },
  methods: {
    toggleFold() {
      this.isFold = !this.isFold;
      console.log("isFold:", this.isFold);
    }
  }
};
</script>

<style lang="scss" scoped>
.node {
  display: flex;
  flex-direction: column;
  &__indent {
    width: 1em;
  }
  .element {
  }
  .text {
    white-space: pre;
  }
  .comment {
    display: flex;
  }
}
</style>
