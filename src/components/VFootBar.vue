<template>
  <div class="foot-bar">
    <template v-for="(btn, index) in buttons">
      <button :key="index + btn.text"
        class="button"
        :class="{'disable': btn.disable == true}"
        @click="onClick(btn)">
        {{btn.text}}
      </button>
      <!-- 最后一个不显示分隔符 -->
      <div v-if="index < buttons.length - 1" :key="index" class="separator" />
    </template>
  </div>  
</template>

<script>
import { isFunction } from "@/utils";
export default {
  props: {
    /**
     * 按钮
     * {
     *  text: String, // 按钮文案
     *  disable: Boolean, // 禁用
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
  mounted() {},
  methods: {
    onClick(btn) {
      if (isFunction(btn.click)) {
        btn.click.call(null);
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../styles/variable";
.foot-bar {
  border-top: 1px solid #d9d9d9;
  height: $footbar-height;
  display: flex;
  flex-direction: row;
  .button {
    outline: none;
    padding: 0;
    border: none;
    width: 100%;
    background-color: #fff;
    &:active {
      background-color: rgba(0, 0, 0, 0.15);
    }
    &.disable {
      color: #cdcdcd;
      &:active {
        background-color: #fff;
      }
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
