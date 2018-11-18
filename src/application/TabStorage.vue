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
          <div class="table__cell table__cell--head">Key({{storage.length}})</div>
          <div class="table__cell table__cell--head">Value</div>
        </div>
      </div>
      <div class="table__body" v-prevent-bkg-scroll>
        <div class="table__row"
          v-for="(value, key) in filteredKeyValueMap"
          :key="key"
          :class="{'table__row--selected': select === key}"
          :ref="key"
          @click="onClickRow(key)"
          >
          <template v-if="select === key && isEditting">
            <div class="table__cell table__cell--edit">
              <input v-model="edittingName" ref="activeInput" />
            </div>
            <div class="table__cell table__cell--edit">
              <input v-model="edittingValue" />
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
      // 过滤关键字
      filter: "",
      // 当前选项的名称
      select: "",
      // 是否处于编辑状态
      isEditting: false,
      // 当前编辑键值对
      edittingName: "",
      edittingValue: "",
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
    // length () {
    //   return Object.keys(this.keyValueMap).length
    // },
    storage() {
      return window[this.storageType];
    },
    filteredKeyValueMap() {
      const keyValueMap = this.keyValueMap;
      const filter = this.filter;
      if (filter) {
        return Object.keys(keyValueMap)
          .filter(key => key.indexOf(filter) >= 0 || keyValueMap[key].indexOf(filter) >= 0)
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
    // 任务调度器
    this._scheduler = new TaskScheduler(150);
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
    /**
     * 进入编辑状态
     * @param {String} name 初始值
     * @param {String} value 初始值
     */
    startEdit(name, value) {
      this.select = name;
      this.isEditting = true;
      this.edittingName = name;
      this.edittingValue = value;

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
     * @returns 最后一次编辑的 name/value
     */
    endEdit() {
      const data = {
        name: this.edittingName,
        value: this.edittingValue
      };
      this.isEditting = false;
      this.edittingName = "";
      this.edittingValue = "";
      return data;
    },
    onRefresh() {
      this.keyValueMap = {};
      const storage = this.storage;

      /* 分片展示数据，避免阻塞交互 */
      const scheduler = this._scheduler;
      if (scheduler) {
        scheduler.stop();
      }
      const step = 200;
      for (let i = 0; i < storage.length / step; ++i) {
        scheduler.add(() => {
          const temp = {};
          const start = i * step;
          const end = Math.min((i + 1) * step, storage.length);
          let key = "";
          let value = "";
          for (let j = start; j < end; ++j) {
            key = storage.key(j);
            value = storage.getItem(key);
            temp[key] = value;
          }
          this.keyValueMap = Object.assign({}, this.keyValueMap, temp);
        });
      }
      scheduler.start();
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
    },
    onClickEdit() {
      if (!this.select) return;

      const name = this.select;
      this.startEdit(name, this.keyValueMap[name]);
    },
    onClickRow(name) {
      if (!this.isEditting) {
        this.select = name;
      }
    },
    onClickSave() {
      if (!this.isEditting) return;

      /**
       * 编辑从 <keyA, valueA> 修改为 <keyB, valueB>，点击保存时处理
       * 1.更新选中项为 keyB
       * 2.移除 keyA 和 keyB
       * 3.新增 KeyB
       * 4. 如果 keyB 为空
       *  4.1 如果 keyA 为空，则移除 keyA 和 keyB
       *  4.2 否则，移除 keyA
       */

      const oldName = this.select;
      const oldValue = this.keyValueMap[oldName];
      const { name, value } = this.endEdit();
      if (name === oldName && value === oldValue) {
        logger.log("onClickSave no change");
        return;
      }

      // 选中新值
      this.select = name;

      // storage：移除旧值，添加新值
      const storage = this.storage;
      storage.removeItem(oldName);
      storage.removeItem(name);
      if (name) {
        storage.setItem(name, value);
      }

      // 视图层：移除旧值，添加新增
      const keyValueMap = this.keyValueMap;
      if (oldName in keyValueMap) {
        delete keyValueMap[oldName];
      }
      if (name in keyValueMap) {
        delete keyValueMap[name];
      }
      if (name) {
        keyValueMap[name] = value;
        // 将新增项滚动到可见区域
        const el = this.$refs[name][0];
        if (el) el.scrollIntoView();
      }
    },
    onClickAdd() {
      const item = {
        name: "",
        value: ""
      };
      this.keyValueMap[item.name] = item.value;
      this.startEdit(item.name, item.value);
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
    &--edit {
      padding: 0;
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
</style>
