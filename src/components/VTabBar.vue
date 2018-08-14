<template>
  <div class="v-tab-bar" :class="{'show-bottom-border': showBottomBorder}">
    <div class="tab-bar">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-tab-bar",
  props: {
    value: String,
    showBottomBorder: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    updateSelectedItem(id) {
      this.$emit("input", id);
    }
  }
};
</script>

<style lang="scss" scoped>
$toolbar-bg-color: #f3f3f3;
.v-tab-bar {
  // position: relative;
  height: 40px;
  background-color: $toolbar-bg-color;
  &.show-bottom-border {
    border-bottom: 1px solid rgb(205, 205, 205);
  }
  .tab-bar {
    height: 100%;
    display: flex;
  }
  // .tab-slider {
  //   position: absolute;
  //   left: 0px;
  //   bottom: 0px;
  //   height: 2px;
  //   background-color: #03a9f4;
  //   transform-origin: 0 100%;
  //   transition: transform 150ms cubic-bezier(0, 0, 0.2, 1);
  // }
}
</style>
