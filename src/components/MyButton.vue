<template>
  <button class="clear-style" @click="$emit('click')"><slot></slot></button>
</template>

<script>
export default {
}
</script>

<style scoped>
  button.clear-style {
    outline: none;
    padding: 0;
    border: none;
  }
  button {
    width: 100%;
    background-color: #fff;
  }
  button:active {
    background-color: rgba(0,0,0,.15);
  }
</style>
