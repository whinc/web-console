<template>
  <div class="tab-preview">
    <div v-if="isImage" class="image-container">
      <img :src="requestInfo.url" />
    </div>
    <div v-else-if="isPlain" class="html-container">
      <iframe :src="'data:text/plain,' + content" sandbox="" />
    </div>
    <div v-else-if="isHtml" class="html-container">
      <iframe :src="'data:text/html,' + content" sandbox="" />
    </div>
    <div v-else-if="isJSON && isValidJSON(content)">
      <VJSONViewer :value="parseJSON(content)" />
    </div>
    <div v-else>
      <VHighlightView class="data" :language="language" :code="content" />
    </div>
  </div>
</template>


<script>
import { VJSONViewer, VHighlightView } from "@/components";
import { mimeType2Language } from "@/utils";

export default {
  components: {
    VJSONViewer,
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
    isImage() {
      return /image/.test(this.contentType);
    },
    isPlain() {
      return /plain/.test(this.contentType);
    },
    isHtml() {
      return /html/.test(this.contentType);
    },
    isJSON() {
      return /json/.test(this.contentType);
    }
  },
  methods: {
    isValidJSON(text) {
      try {
        JSON.parse(text);
        return true;
      } catch (error) {
        return false;
      }
    },
    parseJSON(text) {
      return JSON.parse(text);
    }
  }
};
</script>


<style lang="scss" scoped>
.tab-preview {
  height: 75vw;
  overflow: scroll;
  .image-container {
    height: 100%;
    padding: 20px 20px 10px 20px;
    text-align: center;
    img {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
      background: url("../../assets/icons/transparent_bg.png");
      background-repeat: repeat;
    }
  }
  .html-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    iframe {
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      flex-grow: 1;
      margin: 20px;
    }
  }
  .data {
    overflow-x: scroll;
  }
  .no-data {
    color: hsla(0, 0%, 65%, 1);
  }
}
</style>
