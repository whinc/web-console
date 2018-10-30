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
      <pre class="data"><code ref="code" class="source-code hljs" :class="language">{{content}}</code></pre>
    </div>
  </div>
</template>


<script>
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import htmlbars from "highlight.js/lib/languages/htmlbars";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import { VJSONViewer } from "@/components";
// import 'highlight.js/styles/default.css'
import "./chrome.scss";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("htmlbars", htmlbars);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);

export default {
  components: {
    VJSONViewer
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
      const contentType = this.contentType;
      // 将 HTTP content-type 类型转换成 highlight.js 所支持的语法高亮类型
      switch (true) {
        case /javascript/.test(contentType):
          return "javascript";
        case /json/.test(contentType):
          return "json";
        case /html/.test(contentType):
          return "html";
        case /css/.test(contentType):
          return "css";
        default:
          return "";
      }
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
  watch: {
    // 内容变化时重新计算高亮
    content(newValue) {
      if (!this.$refs.code) return;

      // 解析并高亮比较耗时，放在异步函数中处理
      setTimeout(() => {
        if (!this.$refs.code) return;
        let result;
        // console.log("contentType", this.contentType, "language:", this.language);

        if (this.language) {
          result = hljs.highlight(this.language, this.content, true);
        } else {
          result = hljs.highlightAuto(this.content);
        }
        this.$refs.code.innerHTML = result.value;
      });
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
      background: url("../assets/icons/transparent_bg.png");
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
