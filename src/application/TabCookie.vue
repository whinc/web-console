<template>
  <div class="tab-cookie">
    <div class="tab-cookie__head toolbar">
      <VIcon name="refresh" class="toolbar__button" @click="onRefresh" />
      <VIcon name="ban" class="toolbar__button" @click="onClearAll" />
      <VIcon name="close" class="toolbar__button" @click="onClearSelected" />
      <input class="toolbar__input" type="text" placeholder="Filter" v-model="filter" />
    </div>
    <table class="table">
      <thead>
        <tr class="table__row table__row--head">
          <th class="table__cell table__cell--head">Name</th>
          <th class="table__cell table__cell--head">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{name, value} in filteredCookieList"
          :key="name"
          class="table__row"
          :class="{'table__row--selected': select === name}"
          @click="select = name"
        >
          <td class="table__cell">{{name}}</td>
          <td class="table__cell">{{value}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
import { cookie } from "cookie_js";
import { VIcon } from "@/components";
import { _console } from "@/utils";
export default {
  components: {
    VIcon
  },
  data() {
    return {
      filter: "",
      select: "",
      // 数据结构 [{name: String, value: String}]
      cookieList: []
    };
  },
  computed: {
    filteredCookieList() {
      const cookieList = this.cookieList;
      const filter = this.filter;
      let filteredCookieList = this.cookieList;
      if (filter) {
        filteredCookieList = this.cookieList.filter(cookie => cookie.name.indexOf(filter) !== -1);
      }

      filteredCookieList.sort((a, b) => {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;
      });
      return filteredCookieList;
    }
  },
  mounted() {
    this.onRefresh();
  },
  methods: {
    onRefresh() {
      const cookies = cookie.all();
      this.cookieList = Object.keys(cookies).map(name => ({ name, value: cookies[name] }));
    },
    onClearAll() {
      this.cookieList = [];
      this.select = "";
      cookie.empty();
    },
    onClearSelected() {
      const select = this.select;
      if (!select) return;

      cookie.remove(select);
      const foundIndex = this.cookieList.findIndex(cookie => cookie.name === select);
      if (foundIndex !== -1) {
        this.cookieList.splice(foundIndex, 1);
      }
      // 选中下一个
      this.select = this.cookieList[foundIndex] ? this.cookieList[foundIndex].name : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-cookie {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__head {
    height: 2.4em;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  &__button {
    padding: 0.5em;
    width: 2.4em;
  }
  &__input {
    flex: 1 1 auto;
    color: #5a5a5a;
    border: 1px solid transparent;
    outline: none;
    height: 80%;
    margin: 0 4px;
    padding: 0 4px;
    &::placeholder {
      color: rgb(128, 128, 128);
    }
    &:focus {
      border: 1px solid #2196f3;
    }
  }
}

.table {
  border-collapse: collapse;
  border-left: none;
  &__row {
    height: 2em;
    &--head {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &--selected {
      color: white;
      background-color: #2196f3;
    }
  }
  &__cell {
    border: 1px solid #aaa;
    border-bottom: 1px solid transparent;
    padding: 0 2px;
    &--head {
      border: 1px solid #aaa;
    }
  }
}
</style>
