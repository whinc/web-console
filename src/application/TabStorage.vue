<template>
  <div class="tab-storage">
    <div class="tab-storage__head toolbar">
      <VIcon name="refresh" class="toolbar__button" @click="onRefresh" />
      <VIcon name="ban" class="toolbar__button" @click="onClearAll" />
      <VIcon name="close" class="toolbar__button" @click="onClearSelected" />
      <input class="toolbar__input" type="text" placeholder="Filter" v-model="filter" />
    </div>
    <table class="table">
      <thead>
        <tr class="table__row table__row--head">
          <th class="table__cell table__cell--head">Key</th>
          <th class="table__cell table__cell--head">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(value, key) in filteredKeyValueMap"
          :key="key"
          class="table__row"
          :class="{'table__row--selected': select === key}"
          @click="select = key"
        >
          <td class="table__cell">{{key}}</td>
          <td class="table__cell">{{value}}</td>
        </tr>
      </tbody>
    </table>
  </div>  
</template>

<script>
import { cookie } from "cookie_js";
import { VIcon } from "@/components";
import { Logger } from "@/utils";

const logger = new Logger("[TabStorage]");

export default {
  components: {
    VIcon
  },
  props: {
    storageType: {
      type: String,
      required: true,
      validator(val) {
        return val === "localStorage" || val === "sessionStorage";
      }
    }
  },
  data() {
    return {
      filter: "",
      select: "",
      /**
       * storage 数据结构
       * {
       *  key: String,
       *  value: String
       * }
       */
      keyValueMap: {}
    };
  },
  computed: {
    storage() {
      return window[this.storageType];
    },
    filteredKeyValueMap() {
      const keyValueMap = this.keyValueMap;
      const filter = this.filter;
      if (filter) {
        return Object.keys(keyValueMap)
          .filter(key => key.indexOf(filter) >= 0)
          .reduce((r, key) => {
            r[key] = keyValueMap[key];
            return r;
          }, {});
      } else {
        return keyValueMap;
      }
    }
  },
  watch: {
    storageType() {
      this.onRefresh();
    }
  },
  mounted() {
    // TODO: 优化点：可见时才刷新
    this.onRefresh();
    // 监听 storage 变化事件
    // 只有在其他页面修改 localStorage 才会触发，并且要求其他页面与当前页面同域名，sessionStorage 修改不会触发改事件
    window.addEventListener("storage", e => {
      if (e.key in this.keyValueMap) {
        this.keyValueMap[e.key] = e.newValue;
      } else {
        this.$set(this.keyValueMap, e.key, e.newValue);
      }
    });
  },
  methods: {
    onRefresh() {
      const storage = this.storage;
      const length = this.storage.length;
      let key = "";
      let value = "";
      let keyValueMap = {};
      for (let i = 0; i < length; ++i) {
        key = storage.key(i);
        value = storage.getItem(key);
        keyValueMap[key] = value;
      }
      this.keyValueMap = keyValueMap;
    },
    onClearAll() {
      this.keyValueMap = {};
      this.storage.clear();
    },
    onClearSelected() {
      const key = this.select;
      if (!key) return;

      this.storage.removeItem(key);
      this.$delete(this.keyValueMap, key);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-storage {
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
    border-bottom: 1px solid transparent;
    padding: 0 4px;
    &:first-child {
      border-right: 1px solid #aaa;
    }
    &--head {
      font-weight: normal;
      border-top: 1px solid rgb(205, 205, 205);
      border-bottom: 1px solid #aaa;
    }
  }
}
</style>
