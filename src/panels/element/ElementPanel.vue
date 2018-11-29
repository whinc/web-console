<template>
  <div class="element-panel">
    <NodeView :el="el" class="source-code" :expandDeepth="5" />
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
      el: document.querySelector("#element"),
      // el: document.documentElement,
      selectedEl: null
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";

.element-panel {
  height: $panel-height;
  overflow: auto;
}
</style>
