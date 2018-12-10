<template>
  <div class="style-property">
    <div class="style-property__item" @click="isExpand = !isExpand">
      <span class="style-property__name">{{name}}</span>
      <span>:</span>
      <span
        class="style-property__value"
        :class="[isExpandable ? (isExpand ? 'expand' : 'collapse') : '']"
      >
        <template v-if="valueList.length > 1">
          <span>{{valueList[0]}}</span>
          <span class="style-property__color" :style="{'background-color': valueList[1]}"></span>
          <span>{{valueList[2]}}</span>
        </template>
        <span v-else>{{value}}</span>
      </span>
      <span>;</span>
    </div>
    <div v-if="isExpandable && isExpand" class="style-property__children">
      <StyleProperty
        v-for="prop in subProps"
        :key="prop.name"
        :name="prop.name"
        :value="prop.value"
      />
    </div>
  </div>
</template>

<script>
/**
 * 展示 CSS 属性的键值对，支持属性的缩写形式
 *
 * 非缩写形式属性：
 * {
 *  padding-left: 5px
 * }
 *
 * 缩写形式属性：
 * {
 *  padding: 5px;
 *    padding-top: 5px;
 *    padding-right: 5px;
 *    padding-bottom: 5px;
 *    padding-left: 5px;
 * }
 */
export default {
  name: "StyleProperty",
  props: {
    // CSS属性名
    name: String,
    // CSS属性值
    value: String,
    // 子属性
    subProps: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 展开/折叠属性
      isExpand: false
    };
  },
  computed: {
    // 是否可展开属性
    isExpandable() {
      return Array.isArray(this.subProps) && this.subProps.length > 0;
    },
    // 根据颜色值在属性值中的位置，将属性值分成一个数组，数组元素之间间隔一个颜色块
    valueList() {
      const value = this.value;
      const colorRegExp = getColorRegExp();
      const matchResult = value.match(colorRegExp);
      if (matchResult) {
        const colorIndex = matchResult.index;
        const color = matchResult[0];
        return [value.slice(0, colorIndex), color, value.slice(colorIndex)];
      } else {
        return [value];
      }
    }
  }
};

function getColorRegExp() {
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
  getColorRegExp = function() {
    return colorRegExp;
  };
  return colorRegExp;
}

// 返回指定 CSS 属性的属性值中颜色值的位置
function getColorIndex(name) {
  switch (name) {
    case "color":
    case "background-color":
    case "border-bottom-color":
    case "border-top-color":
    case "border-right-color":
    case "border-left-color":
    case "border-left-color":
    case "caret-color":
    case "outline-color":
    case "text-decoration-color":
      return 0;
    default:
      return -1;
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/triangle";

.style-property {
  display: flex;
  flex-direction: column;
  color: rgb(48, 57, 66);
  &__item {
    padding-left: 1.5em;
    line-height: 1.3em;
  }
  &__children {
    padding-left: 1em;
  }
  &__name {
    color: rgb(200, 0, 0);
  }

  &__value {
    padding-left: 0.5em;
    &.collapse::before {
      @include triangle-collapse(6px, #727272);
      margin-right: 0.2em;
    }
    &.expand::before {
      @include triangle-expand(6px, #727272);
      margin-right: 0.2em;
      margin-bottom: 1px;
    }
  }

  &__color {
    display: inline-block;
    vertical-align: middle;
    width: 1em;
    height: 1em;
    margin-right: 3px;
    border: 1px solid rgba(128, 128, 128, 0.6);
  }

  // 不可继承的属性
  &--not-inheritable {
  }
  // 被覆盖的属性
  &--overried {
  }
}
</style>
