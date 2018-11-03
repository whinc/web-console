<template>
  <div class="tab-cookie">
    <div class="toolbar">
      <button @click="onRefresh">refresh</button>
      <button @click="onClearAll">clean all</button>
      <button @click="onClearSelected">clean selected</button>
      <input type="text" placeholder="Filter" v-model="filter">
    </div>
    <table>
      <thead>
        <th>Name</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr
          v-for="{name, value} in filteredCookieList"
          :key="name"
          :class="{selected: select === name}"
          @click="select = name"
        >
          <td>{{name}}</td>
          <td>{{value}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
import { cookie } from "cookie_js";
import { _console } from "@/utils";
export default {
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
  display: flex;
  flex-direction: column;
  .toolbar {
    display: flex;
  }
  table {
    tr.selected {
      background-color: red;
    }
  }
}
</style>
