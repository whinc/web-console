<template>
  <div class="tab-item" @click="change(id)" :class="{selected: getId() === id}">
    <slot></slot>
  </div>  
</template>

<script>
export default {
  props: {
    id: String
  },
  inject: ['change', 'getId'],
}
</script>


<style scoped>
.tab-item {
  flex-grow: 1;
  text-align: center;
  line-height: 29px;
}

.tab-item.selected {
  border-bottom: 1px solid #26a2ff;
}
</style>
