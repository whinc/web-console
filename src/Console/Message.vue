<template>
  <div>{{value}}</div>  
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'log'
    },
    value: {
      type: String,
      default: ''
    },
    params: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
