<template>
  <div class="tab-style source-code" v-prevent-bkg-scroll>
    <div v-for="(styleSheet, i) in displayStyleSheets" :key="i" class="style-sheet">
      <template v-if="styleSheet.type === 'element'">
        <!-- 当前元素不显示头部 -->
        <div v-if="styleSheet.el !== el" class="style-sheet__head">
          Inherited from
          <NodeLink class="style-sheet__monospace" :el="styleSheet.el" />
        </div>
        <StyleRule v-for="(rule, j) in styleSheet.displayRules"
          :key="i + '-' + j"
          :rule="rule"
        />
      </template>
    </div>
    <div class="box-model-container">
      <BoxModel v-if="el" :el="el" />
    </div>
  </div>
</template>

<script>
import { Logger, getURLFileName, Style } from "@/utils";
import { calculate, compare } from "specificity";
import StyleRule from "./StyleRule";
import NodeLink from "./NodeLink";
import BoxModel from "./BoxModel";

const logger = new Logger("[TabStyles.vue]");
export default {
  components: {
    StyleRule,
    BoxModel,
    NodeLink
  },
  props: {
    el: {
      type: Element,
      default: null
    }
  },
  data() {
    return {
      /**
       * CSS 样式规则
       * 数据结构如下：
       * [
       *   {
       *     // 类型(element, keyframe)
       *     type: String,
       *     el: Element,
       *     displayRules: [
       *       {
       *        // 样式规则来源(styleAttribute, styleSheet)
       *        from: String
       *        // 选择器
       *        selector: String,
       *        // 是否是继承的
       *        inherit: Boolean,
       *        // 样式声明
       *        style: CSSStyleDeclaration,
       *        // 如果是导入或链入的样式表，该字段表示地址
       *        href: String
       *       },
       *       ...
       *     ]
       *   },
       *   ...
       * ]
       */
      displayStyleSheets: []
    };
  },
  mounted() {
    this.displayStyleSheets = getDisplayStyleSheets(this.el);
  },
  methods: {
    getTagName(el) {
      return el.tagName.toLowerCase();
    },
    getId(el) {
      return el.id ? "#" + el.id : "";
    },
    getClass(el) {
      return el.classList.length > 0 ? "." + [].slice.call(el.classList).join(".") : "";
    }
  }
};

/**
 * 获取指定元素的样式表集合，每个样式表内包含一组样式规则列表，按特殊性从高到低排序
 */
function getDisplayStyleSheets(_el) {
  const displayStyleSheets = [];
  let el = _el;
  while (el !== document.documentElement) {
    const inherit = el !== _el;
    const matchedCSSRules = Style.getMatchedCSSRules(el);
    // logger.log(matchedCSSRules);
    const displayRules = matchedCSSRules.sort(Style.compareCSSRule).map((rule, index) => {
      // 映射 CSSRule 到视图所需数据结构
      return {
        from: "styleSheet",
        inherit,
        // 出现顺序，值越小表示越先出现
        order: rule.order,
        selector: rule.selectorText,
        style: rule.style,
        href: (rule.parentStyleSheet && getURLFileName(rule.parentStyleSheet.href)) || "<style>...</style>"
      };
    });

    /**
     * 添加内联样式到样式规则列表
     * a. 如果是当前元素，无论是否有 CSS 规则都添加一个规则项
     * b. 如果是祖先元素，则只有存在 CSS 规则时才添加规则项
     */
    if (!inherit || el.style.length > 0) {
      displayRules.unshift({
        from: "styleAttribute",
        inherit,
        style: el.style
      });
    }

    if (displayRules.length > 0) {
      displayStyleSheets.push({
        type: "element",
        el,
        displayRules
      });
    }
    el = el.parentNode;
  }
  return displayStyleSheets;
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.tab-style {
  flex: auto;
  overflow-y: auto;
}

.style-sheet {
  &__head {
    height: $source-code-font-size * 2;
    line-height: $source-code-font-size * 2;
    padding-right: 2px;
    padding-left: 4px;
    background-color: $tabbar-bg-color;
    border-bottom: 1px solid $divider-color;
  }
  &__monospace {
    background: rgb(255, 255, 255);
    padding: 1px 3px;
    border: 1px solid $divider-color;
  }
}

.box-model-container {
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
</style>
