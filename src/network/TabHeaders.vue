<template>
  <div class="tab-headers">
    <div class="line" v-for="(value, key) in formattedResponseHeaders" :key="key">
      <span class="name">{{key}}: </span>
      <span class="source-code">{{value}}</span>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    responseHeaders: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedResponseHeaders() {
      return Object.keys(this.responseHeaders).reduce(
        (formattedResponseHeaders, key) => {
          const newKey = key
            .split("-")
            .map(v => v[0].toUpperCase() + v.slice(1))
            .join("-");
          const value = this.responseHeaders[key];
          formattedResponseHeaders[newKey] = value;
          return formattedResponseHeaders;
        },
        {}
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../base";

.tab-headers {
  display: flex;
  flex-direction: column;
  .line {
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
}
</style>
