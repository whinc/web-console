<template>
  <div class="tab-style">
    <div v-for="(styleSheet, i) in displayStyleSheets" :key="i">
      <div>{{styleSheet.type}}</div>
      <template v-if="styleSheet.type === 'element'">
        <div v-for="(rule, j) in styleSheet.displayRules" :key="i + '-' + j">
          <template v-if="rule.from === 'styleAttribute'">
            <pre>{{styleSheet.el === el ? 'element.style' : 'Style Attribute'}}     {{rule.href}}{
              <span v-for="(decl, index2) in rule.properties" :key="index2">{{decl.name}}:{{decl.value}}</span>
            </pre>
          </template>
          <template v-else-if="rule.from === 'styleSheet'">
            <pre>{{rule.selector}}     {{rule.href}}{
              <span v-for="(decl, index2) in rule.properties" :key="index2">{{decl.name}}:{{decl.value}}</span>
            </pre>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Logger } from "@/utils";
import { calculate, compare } from "specificity";

const logger = new Logger("[TabStyles]");
export default {
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
       *        // 声明块属性列表
       *        properties: [{
       *          name: String,
       *          value: String,
       *          important: Boolean
       *        }, ...],
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
  methods: {}
};

/**
 * 获取样式规则
 */
function getDisplayStyleSheets(_el) {
  const displayStyleSheets = [];
  let el = _el;
  while (el !== document.documentElement) {
    const cssRules = getMatchCSSRules([].slice.call(document.styleSheets), el);
    const displayRules = cssRules
      .map(rule => {
        return {
          from: "styleSheet",
          selector: rule.selectorText,
          properties: getDeclarationProperties(rule.style),
          href: (rule.parentStyleSheet && rule.parentStyleSheet.href) || ""
        };
      })
      .sort((a, b) => compare(b.selector, a.selector));

    // 元素 style 属性的 specifity 最大，应排在最前面
    if (el.style.length > 0) {
      displayRules.unshift({
        from: "styleAttribute",
        properties: getDeclarationProperties(el.style)
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
 * @param {Array<StyleSheet>} styleSheets
 * @param {Element} el
 * @returns {Array<CSSRule>}
 */
function getMatchCSSRules(styleSheets, el) {
  const rules = [];
  while (styleSheets.length > 0) {
    const styleSheet = styleSheets.shift();
    try {
      for (let j = 0; j < styleSheet.cssRules.length; ++j) {
        const rule = styleSheet.cssRules[j];
        switch (rule.type) {
          case CSSRule.STYLE_RULE:
            if (el.matches(rule.selectorText)) {
              rules.push(rule);
              // logger.log(rule.type, rule)
            }
            break;
          case CSSRule.IMPORT_RULE:
            styleSheets.unshift(rule.styleSheet);
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
 * 获取 CSSStyleDeclaration 的属性列表
 * @param {CSSStyleDeclaration}
 * @returns {Array}
 */
function getDeclarationProperties(declaration) {
  const properties = [];
  for (let i = 0; i < declaration.length; ++i) {
    const name = declaration.item(i);
    const value = declaration.getPropertyValue(name);
    const priority = declaration.getPropertyPriority(name);
    properties.push({
      name,
      value,
      important: priority === "important"
    });
  }
  return properties;
}
</script>


<style lang="scss" scoped>
.tab-style {
  height: 100%;
  overflow-y: auto;
}
</style>
