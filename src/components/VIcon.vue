<template>
  <span class="icon" :class="'icon--' + name" @click="!disable && $emit('click')">
    <img v-if="name === 'setting'" src="@/assets/icons/setting.png"/>
    <template v-else-if="name === 'close'">
      <img v-if="disable" src="@/assets/icons/close-disable.png"/>
      <img v-else src="@/assets/icons/close.png"/>
    </template>
    <img v-else-if="name === 'refresh'" src="@/assets/icons/refresh.png"/>
    <img v-else-if="name === 'ban'" src="@/assets/icons/ban.png"/>
    <template v-else-if="name === 'edit'">
      <img v-if="disable" src="@/assets/icons/edit-disable.png"/>
      <img v-else src="@/assets/icons/edit.png"/>
    </template>
    <template v-else-if="name === 'save'">
      <img v-if="disable" src="@/assets/icons/save-disable.png"/>
      <img v-else src="@/assets/icons/save.png"/>
    </template>
    <template v-else-if="name === 'add'">
      <img v-if="disable" src="@/assets/icons/add-disable.png"/>
      <img v-else src="@/assets/icons/add.png"/>
    </template>
    <img v-else-if="name === 'cancel'" src="@/assets/icons/close.png"/>
    <img v-else-if="name === 'expand'" src="@/assets/icons/expand.png"/>
    <img v-else-if="name === 'collapse'" src="@/assets/icons/collapse.png"/>
  </span>
</template>

<script>
/**
 * 内置图标
 *
 * 使用示例:
 * <VIcon
 *  name="setting"
 *  @click="onClick"
 * />
 */
export default {
  props: {
    // 图标名称（必须是支持的图标名）
    name: {
      type: String
      // validator(type) {
      //   return ["setting", "close", "refresh", "ban"].indexOf(type) !== -1;
      // }
    },
    disable: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
  }
}
</style>
