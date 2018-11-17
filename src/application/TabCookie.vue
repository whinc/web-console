<template>
  <div class="tab-cookie">
    <div class="tab-cookie__head toolbar">
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
          <div class="table__cell table__cell--head">Name({{cookieList.length}})</div>
          <div class="table__cell table__cell--head">Value</div>
        </div>
      </div>
      <div class="table__body" v-prevent-bkg-scroll>
        <div class="table__row"
            v-for="{name, value} in filteredCookieList"
            :key="name"
            :class="{'table__row--selected': select === name}"
            @click="onClickRow(name)"
          >
          <template v-if="select === name && isEditting">
            <div class="table__cell table__cell--edit">
              <input v-model="edittingName" ref="activeInput" />
            </div>
            <div class="table__cell table__cell--edit">
              <input v-model="edittingValue" />
            </div>
          </template>
          <template v-else>
            <div class="table__cell">{{name}}</div>
            <div class="table__cell">{{value}}</div>
          </template>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import { cookie } from "cookie_js";
import { VIcon } from "@/components";
import { _console } from "@/utils";

/**
 * Cookie 视图
 *
 * 操作按钮禁用状态：
 *            refresh clear-all clear-select edit/save  add
 * 未选中      yes     yes       no           no         yes
 * 选中且编辑   yes     yes       yes          yes        yes
 * 编辑中      yes     yes       yes          no/yes     no
 *
 * 编辑状态下无法修改选中行
 */
export default {
  components: {
    VIcon
  },
  data() {
    return {
      // 过滤关键字
      filter: "",
      // 当前选中 cookie 的名称
      select: "",
      // 是否处于编辑状态
      isEditting: false,
      // 当前编辑键值对
      edittingName: "",
      edittingValue: "",
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
    onClickRow(name) {
      if (!this.isEditting) {
        this.select = name;
      }
    },
    onRefresh() {
      const cookies = cookie.all();
      this.cookieList = Object.keys(cookies).map(name => ({ name, value: cookies[name] }));
      this.endEdit();
    },
    onClearAll() {
      this.cookieList = [];
      this.select = "";
      cookie.empty();
      this.endEdit();
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
      this.endEdit();
    },
    /**
     * 编辑 cookie 事件处理
     */
    onClickEdit() {
      if (!this.select) return;

      const name = this.select;
      this.startEdit(name, cookie.get(name));
    },
    /**
     * 更新 cookie 事件处理
     */
    onClickSave() {
      if (!this.isEditting) return;

      /**
       * 编辑 cookie 从 <keyA, valueA> 修改为 <keyB, valueB>，点击保存时处理
       * 1.更新选中项为 keyB
       * 2.移除 keyA 和 keyB
       * 3.新增 KeyB
       * 4. 如果 keyB 为空
       *  4.1 如果 keyA 为空，则移除 keyA 和 keyB
       *  4.2 否则，移除 keyA
       */

      const oldName = this.select;
      const { name, value } = this.endEdit();
      // 选中新值
      this.select = name;

      // document.cookie：移除旧值，添加新值
      cookie.remove(oldName);
      cookie.remove(name);
      if (name) {
        cookie.set(name, value);
      }

      // 视图层：移除旧值，添加新增
      const cookieList = this.cookieList;
      const oldIndex = cookieList.findIndex(v => v.name === oldName);
      if (oldIndex >= 0) {
        cookieList.splice(oldIndex, 1);
      }
      const index = this.cookieList.findIndex(v => v.name === name);
      if (index >= 0) {
        cookieList.splice(oldIndex, 1);
      }
      if (name) {
        cookieList.push({ name, value });
      }
    },
    /**
     * 新增 cookie 事件处理
     */
    onClickAdd() {
      const item = {
        name: "",
        value: ""
      };
      this.cookieList.unshift(item);
      this.startEdit(item.name, item.value);
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
