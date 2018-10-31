<template>
  <div class="v-tab-bar" :class="{'show-bottom-border': showBottomBorder}">
    <div class="item-container">
      <slot></slot>
    </div>
    <div class="icon-container">
      <slot name="icons"></slot>
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
@import "../base.scss";
.v-tab-bar {
  height: $tabbar-height;
  background-color: $tabbar-bg-color;
  display: flex;
  flex: 0 0 auto;
  &.show-bottom-border {
    border-bottom: 1px solid $tabbar-border-color;
  }
  .item-container {
    height: 100%;
    display: flex;
    flex: 1 1 auto;
  }
  .icon-container {
    height: 100%;
    display: flex;
    flex: 0 0 none;
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
