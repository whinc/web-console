<template>
  <div class="tab-storage">
    <div class="tab-storage__head toolbar">
      <VIcon name="refresh" class="toolbar__button" @click="onRefresh" />
      <VIcon name="ban" class="toolbar__button" @click="onClearAll" />
      <VIcon name="close" :disable="!select" class="toolbar__button" @click="onClearSelected" />

      <VIcon v-if="isEditting" name="save" class="toolbar__button" @click="onClickSave" />
      <VIcon v-else name="edit" :disable="!select" class="toolbar__button" @click="onClickEdit" />
      <VIcon name="add" :disable="isEditting" class="toolbar__button" @click="onClickAdd" />
      <input class="toolbar__input" type="text" placeholder="Filter" v-model="filter" />
    </div>
    <div class="table">
      <div class="table__head">
        <div class="table__row table__row--head">
          <div class="table__cell table__cell--head">Key({{storageLength}})[{{kvList.length}}]</div>
          <div class="table__cell table__cell--head">Value</div>
        </div>
      </div>
      <div class="table__body"
        v-prevent-bkg-scroll
        v-infinite-scroll="loadMore"
        infinite-scroll-immediate-check="false"
        infinite-scroll-distance="120"
      >
        <div class="table__row"
          v-for="({value, key}) in kvList"
          :key="key"
          :class="{'table__row--selected': select === key}"
          :ref="key"
          @click="onClickRow(key)"
          >
          <template v-if="select === key && isEditting">
            <div class="table__cell table__cell--edit">
              <input v-model="editingKey" ref="activeInput" />
            </div>
            <div class="table__cell table__cell--edit">
              <input v-model="editingValue" />
            </div>
          </template>
          <template v-else>
            <div class="table__cell">{{key}}</div>
            <div class="table__cell">{{value}}</div>
          </template>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import { VIcon } from "@/components";
import { Logger, TaskScheduler } from "@/utils";
import XStorage from "./XStorage";

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
        return ["localStorage", "sessionStorage", "cookieStorage"].indexOf(val) !== -1;
      }
    }
  },
  data() {
    return {
      // 过滤关键字
      filter: "",
      // 当前选项的名称
      select: "",
      // 是否处于编辑状态
      isEditting: false,
      // 当前编辑键值对
      editingKey: "",
      editingValue: "",
      storageLength: 0,
      /**
       * storage 的 key/value 列表
       * @type {Array<{key: String, value: String}>}
       */
      kvList: []
    };
  },
  computed: {},
  watch: {
    filter(val) {
      this._xStorage.setFilter(val);
      this.onRefresh();
    }
  },
  mounted() {
    this._xStorage = new XStorage(this.storageType);
    this.onRefresh();
  },
  methods: {
    onRefresh() {
      logger.log("onRefresh");
      // 最后一条数据的下一条的索引
      this.kvList = [];
      this.storageLength = this._xStorage.length;
      this._xStorage.refresh();
      this.kvList.push(...this._xStorage.loadMoreItems());
    },
    loadMore() {
      // no more data
      if (!this._xStorage.hasMore()) return;

      this.kvList.push(...this._xStorage.loadMoreItems());
    },
    /**
     * 进入编辑状态
     * @param {String} key 初始值
     * @param {String} value 初始值
     */
    startEdit(key, value) {
      this.select = key;
      this.isEditting = true;
      this.editingKey = key;
      this.editingValue = value;

      // 自动聚焦编辑输入框
      this.$nextTick(() => {
        const arr = this.$refs.activeInput;
        if (arr && arr.length > 0) {
          const el = arr[0];
          el.focus({ preventScroll: false });
        }
      });
    },
    /**
     * 结束编辑状态
     * @returns 最后一次编辑的 key/value
     */
    endEdit() {
      const data = {
        key: this.editingKey,
        value: this.editingValue
      };
      this.isEditting = false;
      this.editingKey = "";
      this.editingValue = "";
      return data;
    },
    onClearAll() {
      this._xStorage.clear();
      this.kvList = [];
      this.storageLength = 0;
    },
    onClearSelected() {
      const key = this.select;
      if (!key) return;

      this._xStorage.removeItem(key);
      this.onRefresh();
    },
    onClickEdit() {
      if (!this.select) return;

      const key = this.select;
      const value = this._xStorage.getItem(key);
      this.startEdit(key, value);
    },
    onClickRow(key) {
      if (!this.isEditting) {
        this.select = key;
      }
    },
    onClickSave() {
      if (!this.isEditting) return;

      const oldKey = this.select;
      const oldValue = this._xStorage.getItem(oldKey);
      const { key, value } = this.endEdit();
      if (key === oldKey && value === oldValue && key !== "") {
        logger.log("onClickSave no change");
        return;
      }
      // storage：移除旧值，添加新值
      this._xStorage.removeItem(oldKey);
      // 避免新增项为空的情况
      this._xStorage.removeItem(key);
      if (key) {
        this._xStorage.setItem(key, value);
      }
      this.onRefresh();

      // if (name) {
      //   keyValueMap[name] = value;
      //   // 将新增项滚动到可见区域
      //   if (this.$refs[name]) {
      //     const el = this.$refs[name][0];
      //     if (el) el.scrollIntoView();
      //   }
      // }
    },
    onClickAdd() {
      const item = {
        key: "",
        value: ""
      };
      this.kvList.unshift(item);
      this.startEdit(item.key, item.value);
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
    flex: 0 0 2.4em;
  }
}

.scroll-y {
  overflow-y: auto;
}

.toolbar {
  display: flex;
  align-items: center;
  background-color: rgb(243, 243, 243);
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
    background-color: white;
    border: 1px solid transparent;
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
    &:nth-child(even) {
      background-color: rgb(242, 247, 253);
    }
    // 覆盖 nth-child 的背景色
    &--selected.table__row {
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
    &--edit {
      padding: 0;
      color: black;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.1);
      background-color: white;
      input {
        outline: none;
        height: 100%;
        width: 100%;
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.editing {
}
</style>
