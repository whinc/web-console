/**
 * 处理 CSS 样式的工具方法
 */
import { compare } from "specificity";
import Logger from "./Logger";

const logger = new Logger("[Style.js]");

/**
 * 获取与指定元素匹配的所有样式规则
 *
 * ----- index.html
 * <style>
 * @import stylesheet_import1.css
 *
 * #id {
 *  color: red;
 * }
 * </style>
 * <link rel="stylesheet" href="stylesheet_link.css" />
 * <div id="id"></div>
 *
 * ----- stylesheet_import1.css
 * @import stylesheet_import2.css
 * #id {
 *  color: blue;
 * }
 *
 * ----- stylesheet_import2.css
 * #id {
 *  color: green;
 * }
 *
 * ----- stylesheet_link.css
 * #id {
 *  color: yellow;
 * }
 *
 * Chrome DevTools 审查元素 div#id 的样式规则优先级从高到低为：
 * #id {color: yellow;} // from stylesheet_link.css
 * #id {color: red;}  // from <style>...</style>
 * #id {color: blue;} // from stylesheet_import1.css
 * #id {color: green;} // from stylesheet_import2.css
 *
 * 相同 specificity 的选择器按照出现的先后顺序层叠，后面的元素覆盖前面元素
 * 通过 @import 导入的元素视作原地展开后按出现顺序层叠。
 * document.styleSheets 返回的列表是按声明顺序排序，如果有 @import 则是递归嵌套
 *
 * @param {Element} el
 * @param {Array<StyleSheet>} styleSheets
 * @returns {Array<CSSRule>} 匹配的规则列表，按出现先后顺序排列
 */
function getMatchedCSSRules(el, styleSheets = [].slice.call(document.styleSheets)) {
  if (!(el instanceof Element)) {
    throw new Error("invalid params type");
  }

  const rules = [];
  // 深度优先遍历 样式表和 CSS 规则
  // stylesheet
  //  import rule
  //    stylesheet
  //      style rule
  //  style rule
  // stylesheet
  while (styleSheets.length > 0) {
    const styleSheet = styleSheets.shift();
    try {
      const cssRuleArr = [].slice.call(styleSheet.cssRules);
      while (cssRuleArr.length > 0) {
        const rule = cssRuleArr.shift();
        switch (rule.type) {
          case CSSRule.IMPORT_RULE:
            // 根据层叠规则，导入样式视作在当前样式表所有规则之前
            cssRuleArr.unshift(...getMatchedCSSRules(el, [rule.styleSheet]));
            break;
          case CSSRule.STYLE_RULE:
            if (el.matches(rule.selectorText)) {
              // 设置出现顺序，值越小表示越先出现
              rule.order = rules.length;
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
      logger.warn(e);
      continue;
    }
  }
  return rules;
}

/**
 * 根据特殊性排序，如果特殊性相同则按出现顺序排序，排在数组越前的特殊性越高
 * @param {CSSRule} a
 * @param {CSSRule} b
 * @returns {Number}
 */
function compareCSSRule(a, b) {
  const selectorA = findMaxSpecificity(a.selectorText);
  const selectorB = findMaxSpecificity(b.selectorText);
  const c = compare(selectorA, selectorB);
  return c === 0 ? b.order - a.order : -c;
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

/**
 * 返回一个匹配 CSS 有效颜色值的 RegExp 对象
 */
let _cachedColorRegExp = null;
function getColorRegExp() {
  if (_cachedColorRegExp) {
    return _cachedColorRegExp;
  }

  const basicColor = [
    "black",
    "silver",
    "gray",
    "white",
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "green",
    "lime",
    "olive",
    "yellow",
    "navy",
    "blue",
    "teal",
    "aqua"
  ].join("|");
  const extendColor = [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen"
  ].join("|");
  const rgbColor = "rgba?([^)]+)";
  const hslaColor = "hsla?([^)]+)";
  const hexColor = "#[0-9a-fA-F]{1,8}";

  const colorRegExp = new RegExp([hexColor, rgbColor, hslaColor, basicColor, extendColor].join("|"), "i");
  _cachedColorRegExp = colorRegExp;
  return colorRegExp;
}

export default {
  getMatchedCSSRules,
  compareCSSRule,
  getColorRegExp
};
