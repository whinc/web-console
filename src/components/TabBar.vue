<template>
  <div class="tab-bar">
    <slot></slot>
  </div>  
</template>

<script>
export default {
  props: {
    value: String
  },
  provide () {
    return {
      change: this.change,
      getId: this.getId
    }
  },
  methods: {
    getId () {
      return this.value
    },
    change (id) {
      this.$emit('input', id)
    }
  }
}
</script>


<style scoped>
.tab-bar {
  height: 30px;
  display: flex;
  flex-direction: row;
}
</style>
