<template>
  <div class="tab-bar">
    <slot></slot>
  </div>  
</template>

<script>
/**
 * TabBar
 * 
 * <tab-bar v-model="activeTab">
 *  <tab-item id="tab1">
 *    <!-- slot -->
 *  </tab-item>
 * </tab-bar>
 */
export default {
  props: {
    value: String,
    // TabItem 底部是否下划线
    showIndicator: {
      type: Boolean,
      default: true
    },
    // TabItem 是否等宽
    isEqualWidth: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    change (id) {
      this.$emit('input', id)
    }
  }
}
</script>


<style scoped>
.tab-bar {
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>
