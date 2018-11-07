<template>
  <span class="icon-container" :class="name" @click="$emit('click')">
    <svg v-if="name === 'setting'" class="icon" aria-hidden="true" data-prefix="fas" data-icon="cog" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="rgb(90, 90, 90)" d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z">
      </path>
    </svg>
    <svg v-if="name === 'close'" viewPort="0 0 12 12" version="1.1"
     xmlns="http://www.w3.org/2000/svg">
      <line x1="1" y1="11" 
            x2="11" y2="1" 
            stroke="black" 
            stroke-width="2"/>
      <line x1="1" y1="1" 
            x2="11" y2="11" 
            stroke="black" 
            stroke-width="2"/>
    </svg>
  </span>
  </div>  
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
        return ["setting", "close"].indexOf(type) !== -1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-container {
  &.setting {
    width: 40px;
    height: 40px;
    padding: 10px 5px;
    display: flex;
    .icon {
      width: 100%;
    }
  }
  &.close {
    padding: 5px;
    width: 22px;
    height: 22px;
  }
}
</style>
