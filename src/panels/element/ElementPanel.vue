<template>
  <div class="element-panel">
    <NodeView :el="el" />
  </div>
</template>

<script>
import NodeView from "./NodeView";

export default {
  name: "ElementPanel",
  components: {
    NodeView
  },
  data() {
    return {
      el: document.querySelector("#element")
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
