<template>
  <span class="style-color-value">
    <span class="color-box" :style="{'background-color': color}"></span>
    <span>{{color}}</span>
  </span>
</template>

<script>
export default {
  props: {
    // CSS 颜色值
    color: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.style-color-value {
  .color-box {
    display: inline-block;
    vertical-align: middle;
    width: 1em;
    height: 1em;
    margin-right: 3px;
    border: 1px solid rgba(128, 128, 128, 0.6);
  }
}
</style>
