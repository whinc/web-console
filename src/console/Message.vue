<template>
  <div class="message" :class="[type]">{{content}}</div>  
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'log'
    },
    logArgs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    content () {
      return this.logArgs.join(' ')
    }
  }
}
</script>

<style scoped>
.message {
  min-height: 30px;
  padding: 0 4px;
  border-bottom: 1px solid;
  overflow-y: scroll;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.log, .debug, .info {
  color: #000;
  border-color: #FFF;
  background-color: #FFF;
}

.error {
  color: #dc143c;
  border-color: #f4a0ab;
  background-color: #ffe4e1;
}

/* .info {
  color: #6a5acd;
  border-color: #FFF;
  background-color: #FFF;
} */

.warn {
  color: orange;
  border-color: #ffb930;
  background-color: #fffacd;
}

/* .debug {
  color: #daa520;
  border-color: #FFF;
  background-color: #FFF;
} */
</style>
