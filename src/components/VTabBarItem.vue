<template>
  <div class="v-tab-bar-item" :class="{'equal-width': $parent.equalWidth}">
    <div class="tab-item" :class="{selected: isSelected}" @click="$parent.updateSelectedItem(id)">
      <slot></slot>
    </div>
    <div v-if="isSelected" class="tab-slider"></div>
  </div>
</template>

<script>
export default {
  name: "v-tab-bar-item",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    isSelected() {
      return this.$parent.value === this.id;
    }
  }
};
</script>

<style lang="scss" scoped>
$toolbar-hover-bg-color: #eaeaea;
$toolbar-fg-color: #5a5a5a;
$toolbar-selected-fg-color: #333;

.v-tab-bar-item {
  position: relative;
  display: flex;
  height: 100%;
  .tab-item {
    width: 100%;
    color: $toolbar-fg-color;
    border-left: 2px solid transparent;
    border-right: 2px solid transparent;
    padding: 2px 0.8em;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:active {
      background-color: $toolbar-hover-bg-color;
    }
    &.selected {
      color: $toolbar-selected-fg-color;
    }
  }
  .tab-slider {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 2px;
    background-color: #03a9f4;
  }
}

.equal-width {
  flex: 1;
}
</style>
