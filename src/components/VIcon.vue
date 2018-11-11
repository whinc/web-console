<template>
  <span class="icon" :class="'icon--' + name" @click="$emit('click')">
    <img v-if="name === 'setting'" src="@/assets/icons/setting.png"/>
    <img v-else-if="name === 'close'" src="@/assets/icons/close.png"/>
    <img v-else-if="name === 'refresh'" src="@/assets/icons/refresh.png"/>
    <img v-else-if="name === 'ban'" src="@/assets/icons/ban.png"/>
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
      type: String,
      validator(type) {
        return ["setting", "close", "refresh", "ban"].indexOf(type) !== -1;
      }
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
