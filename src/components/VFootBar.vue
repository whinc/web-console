<template>
  <div class="foot-bar">
    <template v-for="(btn, index) in buttons">
      <button :key="index + btn.text" @click="btn.click.call(null)">{{btn.text}}</button>
      <!-- 最后一个不显示分隔符 -->
      <div v-if="index < buttons.length - 1" :key="index" class="separator" />
    </template>
  </div>  
</template>

<script>
export default {
  props: {
    /**
     * 按钮
     * {
     *  text: String, // 按钮文案
     *  click: Function, // 点击事件
     * }
     */
    buttons: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
@import "../base.scss";
.foot-bar {
  border-top: 1px solid #d9d9d9;
  height: $footbar-height;
  display: flex;
  flex-direction: row;
  button {
    outline: none;
    padding: 0;
    border: none;
    width: 100%;
    background-color: #fff;
    &:active {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
  .separator {
    width: 1px;
    height: 80%;
    margin-top: auto;
    margin-bottom: auto;
    border-left: 1px solid #d9d9d9;
  }
}
</style>
