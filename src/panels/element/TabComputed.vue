<template>
  <div class="tab-computed" v-prevent-bkg-scroll>
    <div class="box-model-container">
      <BoxModel v-if="el" :el="el" />
    </div>
    <div class="filter-bar">
      <input class="filter-bar__input" placeholder="Filter" v-model="filter" />
    </div>
    <div class="computed-style table">
      <div v-for="{name, value} in filteredComputedStyleArr" :key="name" class="table__row">
        <div class="table__cell table__cell--name">{{name}}</div>
        <div class="table__cell table__cell--value">{{value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import BoxModel from "./BoxModel";
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
      filter: ""
    };
  },
  computed: {
    computedStyleArr() {
      const computedStyle = window.getComputedStyle(this.el);
      const computedStyleArr = [];
      let name, value;
      for (let i = 0; i < computedStyle.length; ++i) {
        name = computedStyle[i];
        value = computedStyle.getPropertyValue(name);
        computedStyleArr.push({ name, value });
      }

      return computedStyleArr;
    },
    filteredComputedStyleArr() {
      const filter = this.filter;
      if (!filter) return this.computedStyleArr.sort(compareFn);

      return this.computedStyleArr
        .filter(({ name, value }) => {
          return name.indexOf(filter) !== -1 || value.indexOf(filter) !== -1;
        })
        .sort(compareFn);
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
  display: flex;
  flex-direction: column;
  &__row {
    flex: 0 0 $row-height;
    display: flex;
    flex-direction: row;
    background-color: white;
    opacity: 0.5;
    &:nth-child(odd) {
      background-color: #f5f5f5;
    }
    &:active {
      background-color: rgb(235, 242, 252);
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
  }
}
</style>
