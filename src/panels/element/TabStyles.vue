<template>
  <div class="tab-style source-code">
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
  </div>
</template>

<script>
import { Logger, getURLFileName } from "@/utils";
import { calculate, compare } from "specificity";
import StyleRule from "./StyleRule";
import NodeLink from "./NodeLink";

const logger = new Logger("[TabStyles]");
export default {
  components: {
    StyleRule,
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
 * 获取样式规则
 */
function getDisplayStyleSheets(_el) {
  const displayStyleSheets = [];
  let el = _el;
  while (el !== document.documentElement) {
    const inherit = el !== _el;
    const cssRules = getMatchCSSRules([].slice.call(document.styleSheets), el);
    const displayRules = cssRules
      .map((rule, index) => {
        // 映射 CSSRule 到视图所需数据结构
        return {
          from: "styleSheet",
          inherit,
          // 出现顺序，值越小表示越先出现
          order: index,
          selector: rule.selectorText,
          style: rule.style,
          href: (rule.parentStyleSheet && getURLFileName(rule.parentStyleSheet.href)) || "<style>...</style>"
        };
      })
      .sort((a, b) => {
        // 根据特殊性排序，如果特殊性相同则按出现顺序排序，排在数组越前的特殊性越高
        const selectorA = findMaxSpecificity(a.selector);
        const selectorB = findMaxSpecificity(b.selector);
        const c = compare(selectorA, selectorB);
        return c === 0 ? b.order - a.order : -c;
      });

    // 元素 style 属性的 specifity 最大，应排在最前面
    if (el.style.length > 0) {
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

/**
 * 获取与指定元素匹配的所有样式规则
 * document.styleSheets 返回的列表是按声明顺序排序，如果有 @import 则是递归嵌套
 *
 * ----- index.html
 * <style>
 * @import stylesheet_import1.css
 *
 * #id {
 *
 * }
 * </style>
 * <link rel="stylesheet" href="stylesheet_link.css" />
 * <div id="id"></div>
 *
 * ----- stylesheet_import1.css
 * @import stylesheet_import2.css
 * #id {
 *
 * }
 *
 * ----- stylesheet_import2.css
 * #id {
 *
 * }
 *
 * ----- stylesheet_link.css
 * #id {
 *
 * }
 *
 * Chrome DevTools 审查元素 div#id 的样式规则优先级从高到低为：
 * #id stylesheet_link.css
 * #id <style>...</style>
 * #id stylesheet_import1.css
 * #id stylesheet_import2.css
 *
 * 相同 specificity 的选择器按照出现的先后顺序层叠，后面的元素覆盖前面元素
 * 通过 import 导入的元素视作原地展开后按出现顺序层叠。
 *
 * @param {Array<StyleSheet>} styleSheets
 * @param {Element} el
 * @returns {Array<CSSRule>} 匹配的规则列表，按出现先后顺序排列
 */
function getMatchCSSRules(styleSheets, el) {
  const rules = [];
  // 深度优先遍历
  while (styleSheets.length > 0) {
    const styleSheet = styleSheets.shift();
    try {
      const cssRuleArr = [].slice.call(styleSheet.cssRules);
      while (cssRuleArr.length > 0) {
        const rule = cssRuleArr.shift();
        switch (rule.type) {
          case CSSRule.IMPORT_RULE:
            // 根据层叠规则，导入样式视作在当前样式表所有规则之前
            cssRuleArr.unshift(...getMatchCSSRules([rule.styleSheet], el));
            break;
          case CSSRule.STYLE_RULE:
            if (el.matches(rule.selectorText)) {
              rules.push(rule);
              // logger.log(rule.type, rule)
            }
            break;
          default:
            // TODO: 处理其他类型的 CSSRule
            logger.error("unknow CSSRule type:", rule.type);
            break;
        }
      }
    } catch (e) {
      // logger.error('忽略该错误', e)
      continue;
    }
  }
  return rules;
}

/**
 * 找出择器中特殊性最高的选择器
 *
 * 例如：
 * findMaxSpecificity('.a')  // '.a'
 * findMaxSpecificity('.a, #b')  // '#b'
 * findMaxSpecificity('.a, #b, #b.a')  // '#b.a'
 */
function findMaxSpecificity(selector) {
  let _selector;
  if (selector.indexOf(",") !== -1) {
    const selectorArr = selector.split(",");
    _selector = selectorArr[0];
    selectorArr.forEach(v => {
      if (compare(v, _selector) === 1) {
        _selector = v;
      }
    });
  } else {
    _selector = selector;
  }
  return _selector;
}
</script>


<style lang="scss" scoped>
@import "../../styles/variable";

.tab-style {
  height: 100%;
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
</style>
