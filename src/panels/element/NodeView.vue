<template>
  <!-- 为了尽量减少标签的使用，会有重复属性分散在多个同级标签中 -->
  <div v-if="el && el.nodeType === Node.ELEMENT_NODE" class="node element">
    <template v-if="isExpandable">
      <!-- 展开态 -->
      <template v-if="isExpand">
        <!-- 起始标签 -->
        <!-- 只有标签可点击 -->
        <Tag type="start"
          :el="el"
          :class="{'unfold': deepth > 0, 'select': isSelected && selectTagType !== 'end'}"
          :style="indentStyle"
          @click="onClickTag('start')"
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
          :class="{'select': isSelected && selectTagType === 'end'}"
          @click="onClickTag('end')"
        />
      </template>
      <!-- 折叠态-->
      <template v-else>
        <Tag type="inline"
          :el="el"
          :class="{'fold': deepth > 0, 'select': isSelected}"
          :style="indentStyle"
          @click="onClickTag('start')"
          >...</Tag>
      </template>
    </template>
    <!-- 只有一个 Text 类型元素时内联展示 -->
    <template v-else>
      <Tag type="inline"
        :el="el"
        :style="indentStyle"
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
    <span v-if="el.parentNode.nodeName === 'STYLE' || el.parentNode.nodeName === 'SCRIPT'">{{el.data}}</span>
    <span v-else>"{{el.data}}"</span>
  </div>
  <div v-else-if="el && el.nodeType === Node.COMMENT_NODE"
    class="node comment"
    :class="{'select': isSelected}"
    :style="indentStyle"
    @click="onClickTag"
    >
    <span>&lt;!--{{el.data}}--&gt;</span>
  </div>
  <div v-else-if="el && el.nodeType === Node.DOCUMENT_TYPE_NODE"
    class="node doctype"
    :class="{'select': isSelected}"
    :style="indentStyle"
    @click="onClickTag"
    >
    <span>&lt;!doctype html&gt;</span>
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
      // 是否展开
      isExpand: false,
      // 选中的标签类型，用于区分开始标签和结束标签的选中态，其他类型默认选中整个标签
      selectTagType: ""
    };
  },
  computed: {
    Node() {
      return Node;
    },
    isExpandable() {
      const childNodes = this.childNodes;
      if (childNodes.length > 1) return true;

      if (childNodes.length === 0) return false;

      // <style>和<script>标签只有一个节点时折叠
      const tagName = this.el.nodeName.toLowerCase();
      if (childNodes.length === 1 && ["style", "script"].findIndex(v => v === tagName) !== -1) return true;

      // 子节点非 TEXT 类型节点时折叠
      const child = childNodes[0];
      if (child.nodeType !== Node.TEXT_NODE) return true;

      // 其他情况不可折叠，即直接展示内容
      return false;
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
    onClickTag(selectTagType) {
      const el = this.el;
      const selectedEl = this.getSelectedElement();
      if (selectedEl !== el) {
        // 如果未选中则设未选中元素
        this.setSelectedElement(el, this.$el);
      } else {
        const preSelectTagType = this.selectTagType;
        // 如果已选中，且元素可展开，且点击的是开始标签，则切换折叠/展开
        if (this.isExpandable && preSelectTagType === selectTagType && selectTagType !== "end") {
          this.isExpand = !this.isExpand;
        }
      }
      // 只有 Element 类型才有开始和结束标签
      if (this.el.nodeType === Node.ELEMENT_NODE) {
        this.selectTagType = selectTagType;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/triangles";
@import "../../styles/mixins";
$triangles-border-width: 6px;
$selection-bg-color: #2196f3;
.node {
  display: flex;
  flex-direction: column;
  margin-top: 1px;
  line-height: 1.4em;
  .select {
    /deep/ span {
      color: white;
    }
    background-color: $selection-bg-color;
    &.fold::before {
      @include triangles-collapse($triangles-border-width, #fff);
      margin-right: 2px;
    }
    &.unfold::before {
      @include triangles-expand($triangles-border-width, #fff);
      margin-right: 2px;
      margin-bottom: 1px;
    }
  }
  &__indent {
    width: 1em;
  }
  .element {
  }
  .text {
    @include descendant-attr("color", rgb(48, 57, 66));
    white-space: pre-wrap;
    word-break: break-all;
  }
  .comment {
    @include descendant-attr("color", rgb(35, 110, 37));
  }
  // FIXME: '.node .doctype' 选择器无法选中元素，原因位置，暂时用串联选择器解决
  &.doctype {
    @include descendant-attr("color", rgb(192, 192, 192));
    &.select {
      color: white;
      background-color: $selection-bg-color;
    }
  }
  .fold::before {
    @include triangles-collapse($triangles-border-width, #727272);
    margin-right: 2px;
  }
  .unfold::before {
    @include triangles-expand($triangles-border-width, #727272);
    margin-right: 2px;
    margin-bottom: 1px;
  }
}
</style>
