<template>
  <div class="box-model">
    <div class="box" :class="{'box--position': isPositionVisible}">
      <template v-if="isPositionVisible">
        <span class="box__label">position</span>
        <span class="box__label-top">{{computedStyle.top | format('position')}}</span>
        <br>
        <span class="box__label-left">{{computedStyle.left | format('position')}}</span>
      </template>
      <div class="box box--margin">
        <span class="box__label">margin</span>
        <span class="box__label-top">{{computedStyle.marginTop | format}}</span>
        <br>
        <span class="box__label-left">{{computedStyle.marginLeft | format}}</span>
        <div class="box box--border">
          <span class="box__label">border</span>
          <span class="box__label-top">{{computedStyle.borderTopWidth | format}}</span>
          <br>
          <span class="box__label-left">{{computedStyle.borderLeftWidth | format}}</span>
          <div class="box box--padding">
            <span class="box__label">padding</span>
            <span class="box__label-top">{{computedStyle.paddingTop | format}}</span>
            <br>
            <span class="box__label-left">{{computedStyle.paddingLeft | format}}</span>
            <div class="box box--content">
              {{computedStyle.width | format('content')}} x {{computedStyle.height | format('content')}}
            </div>
            <span class="box__label-right">{{computedStyle.paddingRight | format}}</span>
            <br>
            <span class="box__label-bottom">{{computedStyle.paddingBottom | format}}</span>
          </div>
          <span class="box__label-right">{{computedStyle.borderRightWidth | format}}</span>
          <br>
          <span class="box__label-bottom">{{computedStyle.borderBottomWidth | format}}</span>
        </div>
        <span class="box__label-right">{{computedStyle.marginRight | format}}</span>
        <br>
        <span class="box__label-bottom">{{computedStyle.marginBottom | format}}</span>
      </div>
      <template v-if="isPositionVisible">
        <span class="box__label-right">{{computedStyle.right | format('position')}}</span>
        <br>
        <span class="box__label-bottom">{{computedStyle.bottom | format('position')}}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    el: {
      type: Element,
      required: true
    }
  },
  computed: {
    computedStyle() {
      return window.getComputedStyle(this.el);
    },
    isPositionVisible() {
      return this.computedStyle.position !== "static";
    }
  },
  filters: {
    /**
     * 格式化在盒模型中显式的单位值
     * @param {String} value
     * @param {String=} box 有效值 'position', 'margin', 'border', 'padding', content'
     */
    format(value, box) {
      if (value === "auto") {
        if (box === "position") return "-";
        else return value;
      } else if (value === "0px") {
        if (box === "content") return parseFloat(value);
        else return "-";
      } else return parseFloat(value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixins";
@import "../../styles/variables";
.box-model {
  @include initial();
  display: inline-block;
  // 不换行
  white-space: nowrap;
  min-height: 190px;
  font-family: $font-family;
  font-size: $primary-font-size;
}

// 矩形盒子样式
.box {
  @include initial();
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  position: relative;
  margin: 4px;
  padding: 4px;
  border: 1px solid transparent;
  &--position {
    border: 1px dotted rgb(66%, 66%, 66%);
  }
  &--margin {
    border: 1px dashed black;
    background-color: rgba(246, 178, 107, 0.66);
  }
  &--border {
    border: 1px solid black;
    background-color: rgba(255, 229, 153, 0.66);
  }
  &--padding {
    border: 1px dashed grey;
    background-color: rgba(147, 196, 125, 0.55);
  }
  &--content {
    min-width: 100px;
    border: 1px solid gray;
    background-color: rgba(111, 168, 220, 0.66);
  }
  &__label {
    position: absolute;
    left: 3px;
    padding: 0 2px;
  }
  &__label-top,
  &__label-bottom,
  &__label-left,
  &__label-right {
    vertical-align: middle;
  }
}
</style>
