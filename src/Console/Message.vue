<template>
  <div class="container" :class="[type]">{{content}}</div>  
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
  },
  computed: {
    content () {
      return this.value + this.params.join(' ')
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 30px;
  font-size: 18px;
  padding: 0 4px;
  border-bottom: 1px solid;
  overflow-y: scroll;
}

.log {
  color: #000;
  border-color: #FFF;
  background-color: #FFF;
}

.error {
  color: #dc143c;
  border-color: #f4a0ab;
  background-color: #ffe4e1;
}

.info {
  color: #6a5acd;
  border-color: #FFF;
  background-color: #FFF;
}

.warn {
  color: orange;
  border-color: #ffb930;
  background-color: #fffacd;
}

.debug {
  color: #daa520;
  border-color: #FFF;
  background-color: #FFF;
}
</style>
