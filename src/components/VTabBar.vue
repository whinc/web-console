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
/**
 * Tab 栏
 *
 * 使用示例：
 * <VTabBar v-model="activedTab">
 *  <VTabBarItem id="tab1">Tab1</VTabBarItem>
 *  <VTabBarItem id="tab2">Tab2</VTabBarItem>
 * </VTabBar>
 */
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
    &:active {
      background-color: #eaeaea;
    }
  }
}
</style>
