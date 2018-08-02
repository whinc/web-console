<template>
  <div class="content">
    <pre class="source-code">{{value}}</pre>
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
}
</style>
