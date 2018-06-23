<template>
  <div class="foot-bar">
    <slot></slot>
  </div>  
</template>

<script>
export default {
  mounted() {
  }
}
</script>


<style scoped>
.foot-bar {
  position: absolute;
  bottom: 0px;
  height: 39px;
  width: 100%;
  border-top: 1px solid #d9d9d9;
  display: flex;
  flex-direction: row;
}
</style>
