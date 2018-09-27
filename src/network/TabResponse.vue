<template>
  <div class="tab-response">
    <template v-if="hasData">
      <pre class="data"><code ref="code" class="hljs" :class="language">{{content}}</code></pre>
    </template>
    <template v-else>
      <h2 class="no-data">This request has no response data available.</h2>
    </template>
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
    // 内容类型
    contentType: {
      type: String,
      default: "text/plain"
    },
    // 数据
    content: {
      type: String
    }
  },
  computed: {
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
    hasData() {
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
    content(newValue) {
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
  padding: 0px 5px;
  max-height: 50vh;
  overflow-y: scroll;
  .data {
    overflow-x: scroll;
  }
  .no-data {
    color: hsla(0, 0%, 65%, 1);
  }
}
</style>
