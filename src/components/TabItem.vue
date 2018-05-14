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
        selected: this.$parent.value === this.id,
        indicator: this.$parent.showIndicator,
        'equal-width': this.$parent.isEqualWidth
      }
      return myClass
    }
  }
}
</script>


<style scoped>
.tab-item {
  flex: 0 1 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  background-color: white;
}

.tab-item:active {
  background-color: rgba(0, 0, 0, .15);
}

.tab-item.equal-width {
  flex-grow: 1;
}

.tab-item.selected {
}

.tab-item.selected.indicator {
  border-bottom: 1px solid #26a2ff;
}
</style>
