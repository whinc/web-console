<template>
  <div class="tab-response">
    <pre class="data source-code">{{value}}</pre>
  </div>
</template>


<script>
export default {
  props: {
    value: String
  },
  computed: {
    formattedValue() {
      return this.value;
    }
  }
};
</script>


<style lang="scss" scoped>
.tab-response {
  padding: 0px 5px;
  max-height: 50vh;
  overflow-y: scroll;
  .data {
    overflow-x: scroll;
  }
}
</style>
