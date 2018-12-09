<template>
  <div class="style-property">
    <span>&nbsp;&nbsp;&nbsp;</span>
    <span class="style-property__name">{{name}}</span>
    <span>:&nbsp;</span>
    <span>{{value}}</span>
    <span>;</span>
  </div>  
</template>

<script>
export default {
  props: {
    name: String,
    value: String
  }
};
</script>

<style lang="scss" scoped>
.style-property {
  color: rgb(48, 57, 66);
  &__name {
    color: rgb(200, 0, 0);
  }

  &__value {
  }

  // 不可继承的属性
  &--not-inheritable {
  }
  // 被覆盖的属性
  &--overried {
  }
}
</style>
