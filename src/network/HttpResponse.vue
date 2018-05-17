<template>
  <div class="content">
    <pre>{{value}}</pre>
  </div>
</template>


<script>
export default {
  props: {
    value: String
  },
  computed: {
    formattedValue () {
      return this.value
    }
  }
}
</script>


<style scoped>
.content {
  padding: 5px;
}
</style>
