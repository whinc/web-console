<template>
  <div class="tab-computed" v-prevent-bkg-scroll>
    <div class="box-model-container">
      <BoxModel v-if="el" :el="el" />
    </div>
    <div class="filter-bar">
      <input class="filter-bar__input" placeholder="Filter" v-model="filter" />
    </div>
    <div class="computed-style table">
      <template v-for="{name, value, matchedRules} in filteredComputedStyleArr">
        <div class="table__row"
          :class="{'table__row--override': matchedRules.length > 0, 'collapse':  matchedRules.length > 0}"
          :key="name" >
          <div class="table__cell table__cell--name">{{name}}</div>
          <div class="table__cell table__cell--value">{{value}}</div>
        </div>
        <div v-for="(rule, index) in matchedRules"
          class="table__row table__row--intent"
          :class="{'table__row--override': matchedRules.length > 0}"
          :key="name + '-' + index" >
          <div class="table__cell table__cell--value" :class="{'table__cell--through': index !== 0}">{{rule.value}}</div>
          <div class="table__cell table__cell--selector">{{rule.selectorText}}</div>
          <div class="table__cell table__cell--href">{{rule.href}}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Style, Logger, getURLFileName } from "@/utils";
import BoxModel from "./BoxModel";

const logger = new Logger("[TabComputed]");
export default {
  components: {
    BoxModel
  },
  props: {
    el: {
      type: Element,
      required: true
    }
  },
  data() {
    return {
      filter: "",
      computedStyleArr: []
    };
  },
  computed: {
    filteredComputedStyleArr() {
      const filter = this.filter;
      if (!filter) return this.computedStyleArr.sort(compareFn);

      return this.computedStyleArr
        .filter(({ name, value }) => {
          return name.indexOf(filter) !== -1 || value.indexOf(filter) !== -1;
        })
        .sort(compareFn);
    }
  },
  mounted() {
    this.computedStyleArr = this.getComputedStyleArr(this.el);
  },
  methods: {
    // 获取元素的计算样式
    getComputedStyleArr(el) {
      const computedStyle = window.getComputedStyle(el);
      const computedStyleArr = [];

      // 获取与当前元素匹配的所有 CSS 规则，并按层叠顺序进行排序
      const matchedCSSRules = Style.getMatchedCSSRules(el).sort(Style.compareCSSRule);
      // 将元素标签上的 style 属性装饰成一条 CSS 规则，方便统一处理
      matchedCSSRules.unshift({
        selectorText: "element.style",
        style: el.style
      });

      // 搜集计算属性的键值对(如果存在包含该条属性的 CSS 规则就保存下来，后续用于展示)
      let name, value;
      for (let i = 0; i < computedStyle.length; ++i) {
        name = computedStyle[i];
        value = computedStyle.getPropertyValue(name);
        const matchedRules = matchedCSSRules.filter(rule => !!rule.style[name]).map(rule => ({
          value: rule.style[name],
          selectorText: rule.selectorText,
          href: (rule.parentStyleSheet && getURLFileName(rule.parentStyleSheet.href)) || ""
        }));
        computedStyleArr.push({
          name,
          value,
          matchedRules
        });
      }
      // logger.log('matchedCSSRules:', matchedCSSRules)
      // logger.log('computedStyleArr:', computedStyleArr)

      return computedStyleArr;
    }
  }
};

// 计算属性名排序规则
function compareFn(a, b) {
  if (a.name[0] === "-" && b.name[0] !== "-") {
    return 1;
  }
  if (a.name[0] !== "-" && b.name[0] === "-") {
    return -1;
  }
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
}
</script>


<style lang="scss" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";
@import "../../styles/triangles";
.tab-computed {
  flex: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.box-model-container {
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  overflow: scroll;
}

.filter-bar {
  flex: none;
  display: flex;
  border-top: 1px solid $divider-color;
  border-bottom: 1px solid #eee;
  &__input {
    @include input(2em);
    flex: auto;
    padding: 0 4px;
    margin: 3px;
  }
}

.computed-style {
  // 平分垂直空间
  flex: auto;
  margin-top: 3px;
}

.table {
  $row-height: 1.6em;
  $opacity: 0.5;
  $icon-size: 6px;
  $icon-padding: 4px;
  display: flex;
  flex-direction: column;
  &__row {
    flex: 0 0 $row-height;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: white;
    opacity: $opacity;
    // 保留与图标相同宽度的空白空间
    padding-left: $icon-padding + $icon-size;
    &:nth-child(odd) {
      background-color: #f5f5f5;
    }
    &:active {
      background-color: rgb(235, 242, 252);
    }
    &--override {
      opacity: 1;
    }
    &--intent {
      padding-left: 20px;
    }
    &.collapse {
      padding-left: $icon-padding;
      &::before {
        @include triangles-collapse($icon-size, #727272);
      }
    }
    &.expand {
      padding-left: $icon-padding;
      &::before {
        @include triangles-expand($icon-size, #727272);
      }
    }
  }
  &__cell {
    @include text-scroll;
    @include hide-scrollbar;
    line-height: $row-height;
    width: 0;
    margin: 0 4px;
    &--name {
      flex: 2;
      color: rgb(200, 0, 0);
    }
    &--value {
      flex: 1;
      color: $default-color;
    }
    &--through {
      text-decoration: line-through;
    }
    &--selector {
      flex: 1;
      opacity: $opacity;
    }
    &--href {
      flex: 1;
    }
  }
}
</style>
