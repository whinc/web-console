<template>
  <div
    class="tab-item"
    @click="$parent.change(id)"
    :class="myClass"
  >
    <slot></slot>
  </div>  
</template>

<script>
export default {
  props: {
    id: String
  },
  computed: {
    myClass() {
      const myClass = {
        selected: this.$parent.value === this.id && this.$parent.showIndicator,
        'fixed-width': this.$parent.isFixedWidth ? 1 : 0
      }
      return myClass
    }
  }
}
</script>


<style scoped>
.tab-item {
  flex-grow: 0;
}

.tab-item.fixed-width {
  flex-grow: 1;
}

.tab-item.selected {
  border-bottom: 1px solid #26a2ff;
}
</style>
