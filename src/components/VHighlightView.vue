<template>
  <div class="v-highlight-view">
    <code class="source-code hljs" :class="language" v-html="codeHtml"></code>
  </div>
</template>

<script>
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import htmlbars from "highlight.js/lib/languages/htmlbars";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("htmlbars", htmlbars);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);

export default {
  name: "VHightlightView",
  props: {
    // 要高亮处理的代码字符串
    code: {
      type: String,
      default: ""
    },
    // 代码语言
    language: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      codeHtml: ""
    };
  },
  mounted() {
    const language = this.language;
    const code = this.code;

    // 根据指定的语言生成高亮，如未指定则自动检测语言并生成高亮
    let result;
    if (language) {
      result = hljs.highlight(language, code, true);
    } else {
      result = hljs.highlightAuto(code);
    }
    this.codeHtml = result.value;
  }
};
</script>

<style lang="scss" scoped>
.v-highlight-view {
  white-space: pre;
  display: block;
  padding: 5px;
}
</style>

<style lang="scss">
/* hightlight.js style start */

// hightlight.js 生成的标签中不带 hash 值，故需要设为全局样式

/* Original highlight.js style (c) Ivan Sagalaev <maniac@softwaremaniacs.org> */
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #0f0f0f;
  color: #444;

  &-subst {
    color: #444;
  }

  &-comment {
    color: #888888;
  }

  &-type,
  &-string,
  &-number,
  &-selector-id,
  &-selector-class,
  &-quote,
  &-template-tag,
  &-deletion {
    color: #880000;
  }

  &-title,
  &-section {
    color: #880000;
    font-weight: bold;
  }

  &-regexp,
  &-symbol,
  &-variables,
  &-template-variables,
  &-link,
  &-selector-attr,
  &-selector-pseudo {
    color: #bc6060;
  }

  &-literal {
    color: #78a960;
  }

  &-built_in,
  &-bullet,
  &-code,
  &-addition {
    color: #397300;
  }

  /* Meta color: hue: 200 */

  &-meta {
    color: #1f7199;
  }

  &-meta-string {
    color: #4d99bf;
  }

  /* Misc effects */

  &-emphasis {
    font-style: italic;
  }

  &-strong {
    font-weight: bold;
  }
}

/* 覆盖默认样式向 Chrome DevTools 样式看齐 */

$color-normal: black;

.hljs {
  background: #fff;
  color: $color-normal;

  &.html {
    .hljs-name,
    .hljs-tag {
      color: rgb(136, 18, 128);
    }

    .hljs-comment {
      color: rgb(35, 110, 37);
    }

    .hljs-attr {
      color: rgb(153, 69, 0);
    }
    .hljs-string {
      color: rgb(26, 26, 166);
    }
  }

  &.json {
    .hljs-string,
    .hljs-attr {
      color: hsl(1, 80%, 43%);
    }
    .hljs-number {
      color: hsl(248, 100%, 41%);
    }
    .hljs-literal {
      color: hsl(310, 86%, 36%);
    }
  }

  &.javascript {
    .hljs-keyword {
      color: hsl(310, 86%, 36%);
    }
    .hljs-params,
    .hljs-title {
      color: hsl(240, 73%, 38%);
      font-weight: normal;
    }
    .hljs-built_in {
      color: $color-normal;
    }
    .hljs-literal {
      color: hsl(310, 86%, 36%);
    }
    .hljs-number {
      color: hsl(240, 73%, 38%);
    }
    .hljs-string {
      color: hsl(1, 80%, 43%);
    }
  }

  &.css {
    .hljs-attribute,
    .hljs-keyword {
      color: rgb(200, 0, 0);
    }
    .hljs-built_in,
    .hljs-string {
      color: rgb(7, 144, 154);
    }
    .hljs-selector-class {
      color: $color-normal;
    }
  }
}
/* hightlight.js style end */
</style>
