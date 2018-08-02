<template>
  <div class="root">
    <span class="name">{{formmatedName}}:</span>
    <span class="source-code">{{value}}</span>
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

<style lang="scss" scoped>
@import '../base';

.root {
  margin-top: 1px;
  min-height: $primary-font-size;
  line-height: $primary-font-size * 5 / 3;
  .name {
    color: rgb(33%, 33%, 33%);
    font-weight: bold;
    margin-right: 0.25em;
    white-space: nowrap;
  }
}
</style>
