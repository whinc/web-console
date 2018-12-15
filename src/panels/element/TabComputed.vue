<template>
  <div class="tab-computed" v-prevent-bkg-scroll>
    <div class="box-model-container">
      <BoxModel v-if="el" :el="el" />
    </div>
    <div class="computed-style">
    </div>
  </div>
</template>

<script>
import BoxModel from "./BoxModel";
export default {
  components: {
    BoxModel
  },
  props: {
    el: {
      type: Element,
      required: true
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../../styles/mixin";
.tab-computed {
  flex: auto;
  display: flex;
  flex-direction: column;
}

.box-model-container {
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  overflow: scroll;
}

.computed-style {
  // 平分垂直空间
  flex: auto;
}
</style>
