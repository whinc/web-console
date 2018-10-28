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
    // TabItem 等宽显示
    equalWidth: {
      type: Boolean,
      default: false
    },
    // TabBar 显示下边框
    showBottomBorder: {
      type: Boolean,
      default: true
    },
    // 实现 v-model 指令
    value: String
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
  // position: relative;
  height: $tabbar-height;
  background-color: $tabbar-bg-color;
  &.show-bottom-border {
    border-bottom: 1px solid rgb(205, 205, 205);
  }
  .tab-bar {
    height: 100%;
    display: flex;
  }
}
</style>
