<template>
  <div class="element-panel">
    <!-- 使用 v-show 避免销毁组件 -->
    <div v-show="!isStylePanelVisible" class="dom-tree" ref="domTree" v-prevent-bkg-scroll>
      <NodeView v-if="doctype" :el="doctype" class="source-code" />
      <NodeView :el="rootEl" class="source-code" :expandDeepth="1" />
    </div>
    <div v-show="!isStylePanelVisible && selectedEl" class="dom-path" ref="domPath">
      <NodeLink v-for="(path, index) in domPaths" :key="index"
        :el="path.el"
        :selected="index === selectedDomPathIndex"
        :compacted="index !== selectedDomPathIndex && true"
        ref="nodeLinks"
        @click="onClickDomPath(index)"
      />
    </div>
    <!-- 使用 v-if 关闭 inspect panel 时销毁  -->
    <div v-if="isStylePanelVisible" class="inspect-panel">
      <VTabBar v-model="activedTab">
        <VTabBarItem id="styles">Styles</VTabBarItem>
        <VTabBarItem id="computed">Computed</VTabBarItem>
      </VTabBar>
      <TabStyles v-show="activedTab === 'styles'" :el="selectedEl" />
      <TabComputed v-show="activedTab === 'computed'" :el="selectedEl" />
    </div>
    <VFootBar class="foot" :buttons="footBarButtons" />
  </div>
</template>

<script>
import { VFootBar, VTabBar, VTabBarItem } from "@/components";
import { eventBus, Logger } from "@/utils";
import NodeView from "./NodeView";
import TabStyles from "./TabStyles";
import TabComputed from "./TabComputed";
import NodeLink from "./NodeLink";

const logger = new Logger("[ElementPanel]");
export default {
  name: "ElementPanel",
  components: {
    NodeView,
    VFootBar,
    VTabBar,
    VTabBarItem,
    TabStyles,
    TabComputed,
    NodeLink
  },
  provide() {
    return {
      // 更新选中元素及对应组件的引用
      setSelectedElement: (el, ref) => {
        this.selectedEl = el;
        this.selectedRef = ref;
      },
      getSelectedElement: () => {
        return this.selectedEl;
      }
    };
  },
  data() {
    return {
      // rootEl: document.querySelector("#element"),
      // 根节点，渲染该节点的 DOM 树
      rootEl: document.documentElement,
      // 当前选中元素，如果没有值为 null
      selectedEl: null,
      /**
       * 选中元素的 DOM 路径，如 html > body > div#app
       *
       * 数组元素数据结构：
       * {
       *  // DOM 元素
       *  el: Node,
       *  // DOM 元素对应组件的引用
       *  ref: Node
       * }
       */
      domPaths: [],
      // 当前选中的 DOM 路径
      selectedDomPathIndex: -1,
      // 如果屏幕显示不下 DOM 路径，则以紧凑方式显示 DOM 路径
      shouldDomPathCompact: false,
      // 是否显式 inspect 面板
      isStylePanelVisible: false,
      // inspect 面板激活的 tab
      activedTab: "styles"
    };
  },
  computed: {
    doctype() {
      return document.doctype;
    },
    /* eslint-disable */
    footBarButtons() {
      return [
        {
          text: this.isStylePanelVisible ? "Back" : "Inspect",
          disable: !this.selectedEl || this.selectedEl.nodeType !== Node.ELEMENT_NODE,
          click: () => {
            const el = this.selectedEl;
            if (!el) return;
            this.isStylePanelVisible = !this.isStylePanelVisible;
          }
        },
        {
          text: "Hide",
          click: () => {
            eventBus.emit(eventBus.POPUP_HIDE);
          }
        }
      ];
    }
    /* eslint-enable */
  },
  watch: {
    selectedEl(el) {
      if (!el) return;

      // 如果 dom 路径中存在当前所选元素，则激活 dom 路径中该项，否则重新生成 dom 路径
      const foundIndex = this.domPaths.findIndex(path => path.el === el);
      if (foundIndex === -1) {
        const domPaths = [];
        let ref = this.selectedRef;
        while (el && el !== document) {
          domPaths.unshift({
            el: el,
            ref: ref
          });
          el = el.parentNode;
          ref = ref.parentNode;
        }
        this.domPaths = domPaths;
        this.selectedDomPathIndex = domPaths.length - 1;
      } else {
        this.selectedDomPathIndex = foundIndex;
      }

      // 将元素滚动到窗口可视区域
      if (this.$refs.nodeLinks && this.$refs.nodeLinks[this.selectedDomPathIndex]) {
        this.$nextTick(() => {
          this.$refs.nodeLinks[this.selectedDomPathIndex].$el.scrollIntoView();
        });
      }
      this.$nextTick(() => {
        const domPathEl = this.$refs.domPath;
        if (domPathEl) {
          this.shouldDomPathCompact = domPathEl.scrollWidth > domPathEl.clientWidth;
        }
      });
    }
  },
  mounted() {
    // FIXME: test
    // this.selectedEl = document.querySelector("#element");
    // this.isStylePanelVisible = true;
  },
  methods: {
    onClickDomPath(index) {
      this.selectedDomPathIndex = index;

      // 更新选中元素，并将元素滚入可视区域
      const domPath = this.domPaths[index];
      this.selectedEl = domPath.el;
      this.scrollIntoDomTree(domPath.ref);
    },
    /**
     * 将指定元素滚动到 DOM 树可视区域
     *
     *  -------    -------   <-- domTreeEl.getBoundingClientRect().top
     * |       |  |   A   |
     * |       |  |       |
     * |   A   |  |       |  <-- targetEl.getBoundingClientRect().top
     *  -------    -------
     */
    scrollIntoDomTree(targetEl) {
      const domTreeEl = this.$refs.domTree;
      let offsetY = 0;
      if (targetEl.nodeType === Node.ELEMENT_NODE) {
        offsetY = targetEl.getBoundingClientRect().top - domTreeEl.getBoundingClientRect().top;
      } else {
        // TEXT_NODE 和 COMMENT_NODE 等非 Element 类型节点没有 getBoundingClientRect() 方法
        // 但它们的父节点一定是 Element 类型节点，使用其父节点的坐标进行判断
        offsetY = targetEl.parentNode.getBoundingClientRect().top - domTreeEl.getBoundingClientRect().top;
      }
      // 选中元素与 DOM 树顶部的距离，这里取 DOM 树高度的一半，使选中元素垂直居中显示
      const paddingTop = domTreeEl.clientHeight / 2;
      domTreeEl.scrollTop += offsetY - paddingTop;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variable";

.element-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .dom-tree {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 2px 0;
  }
  .dom-path {
    flex: 0 0 auto;
    height: 30px;
    border-top: 1px solid $toolbar-border-color;
    display: flex;
    align-items: center;
    overflow-x: auto;
  }
  .inspect-panel {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }
  .foot {
    flex: 0 0 auto;
  }
}
</style>
