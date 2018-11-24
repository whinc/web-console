<template>
  <div class="tab-response">
    <VHighlightView
      v-if="isTextData"
      class="data"
      :language="language"
      :code="content"
    />
    <div v-else class="no-data">
      <h2>This request has no response data available.</h2>
    </div>
  </div>
</template>


<script>
import { VHighlightView } from "@/components";
import { mimeType2Language } from "@/utils";

export default {
  components: {
    VHighlightView
  },
  props: {
    requestInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    content() {
      return this.requestInfo.response;
    },
    contentType() {
      return this.requestInfo.responseHeaders["content-type"];
    },
    language() {
      return mimeType2Language(this.contentType);
    },
    isTextData() {
      const contentType = this.contentType;
      switch (true) {
        case /image/.test(contentType):
          return false;
        default:
          return true;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.tab-response {
  height: 75vw;
  overflow: scroll;
  .data {
    overflow-x: scroll;
    height: 100%;
    pre,
    code {
      height: 100%;
    }
  }
  .no-data {
    height: 100%;
    color: hsla(0, 0%, 65%, 1);
    h1 {
      height: 100%;
    }
  }
}
</style>
