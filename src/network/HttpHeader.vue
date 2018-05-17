<template>
  <div>
    <span class="name">{{formmatedName}}</span>: {{value}}
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    value: String
  },
  computed: {
    formmatedName () {
      if (!this.name) return ''

      return this.name.split('-').map(v => v[0].toUpperCase() + v.slice(1)).join('-')
    }
  }
}
</script>

<style scoped>
.name {
  font-weight: bold;
}
</style>
