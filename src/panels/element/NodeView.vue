<template>
  <!-- <div v-if="el"> -->
  <div v-if="el && el.nodeType === Node.ELEMENT_NODE" class="node element">
    <template v-if="isExpandable">
      <!-- 展开态 -->
      <template v-if="isExpand">
        <!-- 起始标签 -->
        <!-- 只有标签可点击 -->
        <Tag type="start"
          :el="el"
          :class="{'unfold': deepth > 0, 'select': isSelected}"
          :style="indentStyle"
          @click="onClickTag"
        />
        <!-- 子节点 -->
        <NodeView v-for="(node, index) in childNodes" :key="deepth + '-' + index"
          :el="node"
          :deepth="deepth + 1"
          :expandDeepth="expandDeepth - 1"
        />
        <!-- 结束标签 -->
        <Tag type="end"
          :el="el"
          :style="indentStyle"
          :class="{'select': isSelected}"
          @click="onClickTag"
        />
      </template>
      <!-- 折叠态-->
      <template v-else>
        <Tag type="inline"
          :el="el"
          :class="{'fold': deepth > 0, 'select': isSelected}"
          :style="indentStyle"
          @click="onClickTag"
          >...</Tag>
      </template>
    </template>
    <!-- 只有一个 Text 类型元素时内联展示 -->
    <template v-else>
      <Tag type="inline"
        :el="el"
        :style="indentStyle"
        key="hello"
        :class="{'select': isSelected}"
        @click="onClickTag"
        >{{el.textContent}}</Tag>
    </template>
  </div>  
  <div v-else-if="el && el.nodeType === Node.TEXT_NODE"
    class="node text"
    :class="{'select': isSelected}"
    :style="indentStyle"
    @click="onClickTag"
    >
    <span>"{{el.data}}"</span>
  </div>
  <div v-else-if="el && el.nodeType === Node.COMMENT_NODE"
    class="node comment"
    :class="{'select': isSelected}"
    :style="indentStyle"
    @click="onClickTag"
    >
    <span>&lt;!--{{el.data}}--&gt;</span>
  </div>
  <div v-else
    class="node"
    :class="{'select': isSelected}"
    :style="indentStyle"
    @click="onClickTag"
    >
    <span>&lt;unknow({{el.nodeName}})&gt;</span>
  </div>
  <!-- </div> -->
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
  inject: ["setSelectedElement", "getSelectedElement"],
  props: {
    el: {
      type: Node,
      default: null
    },
    /**
     * 相对根节点的深度
     *
     * 例如节点数为 A>B>C
     * A 的深度为 0
     * B 的深度为 1
     * C 的深度为 2
     */
    deepth: {
      type: Number,
      default: 0
    },
    /**
     * 当前节点往下展开的深度（仅初始有效）
     *
     * 例如节点树为 div>div>div，当前处于第一个 div 处，则：
     * 深度为 0，展示 <div>...</div>
     * 深度为 1，展示 <div><div>...<div></div>
     * 深度为 2，展示 <div><div><div></div><div></div>
     */
    expandDeepth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 是否折叠
      isExpand: false
    };
  },
  computed: {
    Node() {
      return Node;
    },
    isExpandable() {
      const childNodes = this.childNodes;
      return childNodes.length > 1 || (childNodes.length === 1 && childNodes[0].nodeType !== Node.TEXT_NODE);
    },
    isSelected() {
      return this.getSelectedElement() === this.el;
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
  mounted() {
    this.isExpand = this.expandDeepth > 0;
  },
  methods: {
    onClickTag() {
      const el = this.el;
      const selectedEl = this.getSelectedElement();
      if (selectedEl !== el) {
        this.setSelectedElement(el);
      } else {
        if (this.isExpandable) {
          this.isExpand = !this.isExpand;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$triangle-border-width: 6px;
$selection-bg-color: #2196f3;
$selection-inactive-bg-color: #dadada;
$selection-hovered-bg-color: rgba(56, 121, 217, 0.1);
$selection-active-fg-color: white;
.node {
  display: flex;
  flex-direction: column;
  margin-top: 1px;
  .select {
    /deep/ span {
      color: white;
    }
    background-color: $selection-bg-color;
    &.fold::before {
      display: inline-block;
      content: "";
      width: 0;
      height: 0;
      margin-right: 2px;
      /* 等边三角形，tan(30) 约为 0.5773502691896257 */
      border-left: $triangle-border-width solid $selection-active-fg-color;
      border-top: $triangle-border-width * 0.8 solid transparent;
      border-bottom: $triangle-border-width * 0.8 solid transparent;
    }
    &.unfold::before {
      display: inline-block;
      content: "";
      width: 0;
      height: 0;
      margin-right: 2px;
      margin-bottom: 1px;
      border-top: $triangle-border-width solid $selection-active-fg-color;
      border-left: $triangle-border-width * 0.8 solid transparent;
      border-right: $triangle-border-width * 0.8 solid transparent;
    }
  }
  &__indent {
    width: 1em;
  }
  .element {
  }
  .text {
    color: rgb(48, 57, 66);
    white-space: pre;
  }
  .document-type {
    color: rgb(192, 192, 192);
  }
  .comment {
    display: flex;
    color: rgb(35, 110, 37);
  }
  .fold::before {
    display: inline-block;
    content: "";
    width: 0;
    height: 0;
    margin-right: 2px;
    /* 等边三角形，tan(30) 约为 0.5773502691896257 */
    border-left: $triangle-border-width solid #727272;
    border-top: $triangle-border-width * 0.8 solid transparent;
    border-bottom: $triangle-border-width * 0.8 solid transparent;
  }
  .unfold::before {
    display: inline-block;
    content: "";
    width: 0;
    height: 0;
    margin-right: 2px;
    margin-bottom: 1px;
    border-top: $triangle-border-width solid #727272;
    border-left: $triangle-border-width * 0.8 solid transparent;
    border-right: $triangle-border-width * 0.8 solid transparent;
  }
}
</style>
