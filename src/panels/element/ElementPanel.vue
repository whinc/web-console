<template>
  <div class="element-panel">
    <!-- 使用 v-show 避免销毁组件 -->
    <div v-show="!isStylePanelVisible" class="dom-tree" v-prevent-bkg-scroll>
      <NodeView :el="rootEl" class="source-code" :expandDeepth="1" />
    </div>
    <div v-show="!isStylePanelVisible" class="dom-path">
      <NodeLink v-for="(path, index) in domPaths" :key="index"
        :el="path.el"
        :selected="index === selectedDomPathIndex"
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
import { eventBus } from "@/utils";
import NodeView from "./NodeView";
import TabStyles from "./TabStyles";
import TabComputed from "./TabComputed";
import NodeLink from "./NodeLink";

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
      setSelectedElement: el => {
        this.selectedEl = el;
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
      // 选中元素的 DOM 路径，如 html > body > div#app
      domPaths: [],
      // 当前选中的 DOM 路径
      selectedDomPathIndex: -1,
      // 是否显式 inspect 面板
      isStylePanelVisible: false,
      // inspect 面板激活的 tab
      activedTab: "styles"
    };
  },
  computed: {
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
        while (el && el !== document) {
          domPaths.unshift({ el });
          el = el.parentNode;
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
      this.selectedEl = this.domPaths[index].el;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";

.element-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .dom-tree {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 5px;
  }
  .dom-path {
    flex: 0 0 auto;
    height: 30px;
    border-top: 1px solid gray;
    display: flex;
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
