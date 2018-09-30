<template>
  <div class="tab-response">
    <div v-if="isTextData" class="data">
      <pre><code ref="code" class="hljs" :class="language">{{content}}</code></pre>
    </div>
    <div v-else class="no-data">
      <h2>This request has no response data available.</h2>
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
// import 'highlight.js/styles/default.css'
import "./chrome.scss";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("htmlbars", htmlbars);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);

export default {
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
    isTextData() {
      const contentType = this.contentType;
      switch (true) {
        case /image/.test(contentType):
          return false;
        default:
          return true;
      }
    }
  },
  watch: {
    // 内容变化时重新计算高亮
    content(newValue) {
      if (!this.$refs.code) return;
      // 解析并高亮比较耗时，放在异步函数中处理
      setTimeout(() => {
        let result;
        console.log("contentType", this.contentType, "language:", this.language);

        if (this.language) {
          result = hljs.highlight(this.language, this.content, true);
        } else {
          result = hljs.highlightAuto(this.content);
        }
        this.$refs.code.innerHTML = result.value;
      });
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
