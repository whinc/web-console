<template>
  <div class="element-panel">
    <div class="dom-tree" v-prevent-bkg-scroll>
      <NodeView :el="el" class="source-code" :expandDeepth="1" />
    </div>
  </div>
</template>

<script>
import NodeView from "./NodeView";

export default {
  name: "ElementPanel",
  components: {
    NodeView
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
      selectedEl: null
    };
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
}
</style>
