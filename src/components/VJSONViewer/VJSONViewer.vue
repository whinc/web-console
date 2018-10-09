<template>
  <div class="source-code v-json-viewer">
    <JSONTextBlock :descriptor="descriptor" initialUnfold />
  </div>  
</template>

<script>
import JSONTextBlock from "./JSONTextBlock.vue";
import { _console } from "@/utils";

export default {
  components: {
    JSONTextBlock
  },
  props: {
    // 有效的 JSON 值
    value: {
      required: true
    }
  },
  computed: {
    descriptor() {
      let v = "(error)";
      try {
        v = JSON.parse(JSON.stringify(this.value));
      } catch (err) {
        _console.error(err);
      }
      return { value: v };
    }
  }
};
</script>

<style lang="scss" scoped>
.v-json-viewer {
  padding: 5px;
}
</style>
