<template>
  <div class="element-panel">
    <div v-show="!isStylePanelVisible" class="dom-tree" v-prevent-bkg-scroll>
      <NodeView :el="el" class="source-code" :expandDeepth="1" />
    </div>
    <div v-show="isStylePanelVisible" class="style-panel">
      <VTabBar v-model="activedTab">
        <VTabBarItem id="styles">Styles</VTabBarItem>
        <VTabBarItem id="computed">Computed</VTabBarItem>
      </VTabBar>
      <TabStyles v-if="activedTab === 'styles'" />
      <TabComputed v-if="activedTab === 'computed'" />
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

export default {
  name: "ElementPanel",
  components: {
    NodeView,
    VFootBar,
    VTabBar,
    VTabBarItem,
    TabStyles,
    TabComputed
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
      // el: document.querySelector("#element"),
      el: document.documentElement,
      isStylePanelVisible: false,
      // 当前选中元素，如果没有值为 null
      selectedEl: null,
      activedTab: "styles"
    };
  },
  computed: {
    /* eslint-disable */
    footBarButtons() {
      return [
        {
          text: "Styles",
          disable: !this.selectedEl,
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
  .style-panel {
    flex: 1 1 auto;
  }
  .foot {
    flex: 0 0 auto;
  }
}
</style>
