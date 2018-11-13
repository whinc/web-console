<template>
  <div class="tab-cookie">
    <div class="tab-cookie__head toolbar">
      <VIcon name="refresh" class="toolbar__button" @click="onRefresh" />
      <VIcon name="ban" class="toolbar__button" @click="onClearAll" />
      <VIcon name="close" class="toolbar__button" @click="onClearSelected" />
      <input class="toolbar__input" type="text" placeholder="Filter" v-model="filter" />
    </div>
    <div class="table">
      <div class="table__head">
        <div class="table__row table__row--head">
          <div class="table__cell table__cell--head">Name</div>
          <div class="table__cell table__cell--head">Value</div>
        </div>
      </div>
      <div class="table__body" v-prevent-bkg-scroll>
        <div class="table__row"
            v-for="{name, value} in filteredCookieList"
            :key="name"
            :class="{'table__row--selected': select === name}"
            @click="select = name"
          >
          <div class="table__cell">{{name}}</div>
          <div class="table__cell">{{value}}</div>
        </div>
      </div>
    </div>
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
        filteredCookieList = this.cookieList.filter(
          cookie => cookie.name.indexOf(filter) >= 0 || cookie.value.indexOf(filter) >= 0
        );
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
    flex: 0 0 2.4em;
  }
}

.scroll-y {
  overflow-y: auto;
}

.toolbar {
  display: flex;
  align-items: center;
  &__button {
    padding: 0.6em;
    width: 2.4em;
    &:active {
      background-color: #eaeaea;
    }
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
  display: flex;
  flex-direction: column;
  height: 100%;
  &__head {
    flex: 0 0 30px;
  }
  &__body {
    flex: 1 1 auto;
    overflow-y: auto;
  }
  &__row {
    height: 30px;
    display: flex;
    &--head {
      border-top: 1px solid rgb(205, 205, 205);
      border-bottom: 1px solid #aaa;
    }
    &--selected {
      color: white;
      background-color: #2196f3;
    }
  }
  &__cell {
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    padding: 0 4px;

    // 超出时可滚动
    border-right: 1px solid #aaa;
    white-space: nowrap;
    overflow-x: auto;
    &:first-child {
      flex: 0 0 30%;
      max-width: 30%;
    }
    &--head {
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
