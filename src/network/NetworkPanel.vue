<template>
  <div class="network-panel">
    <div class="head">
      <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">
        Name {{requestList.length > 0 ? `(${requestList.length})` : ''}}
      </span>
      <span class="cell">Method</span>
      <span class="cell">Status</span>
    </div>
    <div class="body">
      <NetworkRequest
        v-for="(item, index) in requestList"
        :key="item.id"
        :item="item"
        :is-selected="selectedId === item.id"
        :is-even="index % 2 === 0"
        @click="onClickItem(item.id)"
      />
    </div>
    <VFootBar :buttons="footBarButtons" class="foot" />
  </div>

</template>

<script>
import { TabContainer, TabContainerItem } from "mint-ui";
import { VTabBar, VTabBarItem, VFootBar } from "@/components";
import { nextTick } from "@/utils";
import TabHeaders from "./TabHeaders";
import TabResponse from "./TabResponse";
import NetworkRequest from "./NetworkRequest";

export default {
  components: {
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    VFootBar,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem,
    [TabHeaders.name]: TabHeaders,
    [TabResponse.name]: TabResponse,
    [NetworkRequest.name]: NetworkRequest
  },
  data() {
    return {
      // 请求列表
      requestMap: {},
      // 选中请求的编号
      selectedId: ""
    };
  },
  computed: {
    // 展示的列表（后面会按时间或类型进行排序）
    requestList() {
      return Object.keys(this.requestMap).map(key => this.requestMap[key]);
    },
    footBarButtons() {
      return [
        {
          text: "Clear",
          click: () => {
            this.requestMap = {};
          }
        },
        {
          text: "Hide",
          click: () => {
            this.$root.$emit("hide");
          }
        }
      ];
    }
  },
  mounted() {
    this.hookXMLHttpRequest();
  },
  methods: {
    onClickItem(id) {
      const item = this.requestMap[id];
      // 点击同一行，切换展开态
      // 点击不同行，展开当前选中行，折叠之前选中行
      if (id === this.selectedId) {
        item.isExpand = !item.isExpand;
      } else {
        this.requestMap[id].isExpand = true;
        if (this.requestMap[this.selectedId]) {
          this.requestMap[this.selectedId].isExpand = false;
        }
      }
      this.selectedId = id;
    },
    /**
     * 拦截 XMLHttpRequest 请求并记录状态
     */
    hookXMLHttpRequest() {
      const vm = this;
      const XMLHttpRequest = window.XMLHttpRequest;
      const _open = XMLHttpRequest.prototype.open;
      const _send = XMLHttpRequest.prototype.send;
      const _setRequestHeaders = XMLHttpRequest.prototype.setRequestHeader;

      XMLHttpRequest.prototype.open = function(method, url) {
        const xhr = this;
        const id = vm.genUUID();

        // 保存数据在 xhr 实例中，方便后续获取
        xhr.$id = id;
        xhr.$method = (method || "GET").toUpperCase();
        xhr.$url = url;

        // 返回重写的 onreadystatechange 事件处理程序
        const getOverrideHandler = () => {
          // 监听请求状态变化，并更新视图状态
          const _onreadystatechange = xhr.onreadystatechange || function() {};
          return function() {
            // console.log(
            //   "[NetworkPanel] %s ready state: %s",
            //   url,
            //   xhr.readyState
            // );
            const item = vm.requestMap[id] || {};

            item.readyState = xhr.readyState;
            item.responseType = xhr.responseType;
            switch (xhr.readyState) {
              case 0: // UNSENT
                item.statusText = "(pending)";
                break;
              case 1: // OPENED
                item.statusText = "(pending)";
                break;
              case 2: // HEADERS_RECEIVED
                item.status = xhr.status;
                item.statusText = "(loading)";
                const headers = xhr.getAllResponseHeaders();
                const headerArr = headers.split(/[\r\n]+/);
                const responseHeaders = {};
                headerArr.forEach(line => {
                  if (!line) return;
                  const parts = line.split(": ");
                  const key = parts.shift();
                  const value = parts.join(": ");
                  responseHeaders[key] = value;
                });
                item.responseHeaders = responseHeaders;
                break;
              case 3: // LOADING
                item.status = xhr.status;
                item.statusText = "(loading)";
                break;
              case 4: // DONE
                item.status = xhr.status;
                item.statusText = xhr.status;
                item.response = xhr.response;
                break;
              default:
                break;
            }

            vm.updateRequest(id, item);

            _onreadystatechange.apply(this, arguments);
          };
        };

        // 如果 open() 方法调用前，onreadystatechange 已注册，可以立即重写
        // 否则，在下一个微任务中重写，即等到用户注册后再执行
        if (typeof xhr.onreadystatechange === "function") {
          xhr.onreadystatechange = getOverrideHandler();
        } else {
          nextTick(() => {
            xhr.onreadystatechange = getOverrideHandler();
          });
        }

        _open.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function(...args) {
        const xhr = this;
        const id = xhr.$id;
        const item = vm.requestMap[id] || {};
        item.id = id;
        item.method = xhr.$method;
        item.url = xhr.$url;
        item.status = 0;
        item.statusText = "-";
        if (xhr.$method === "GET" || xhr.$method === "HEAD") {
          item.data = null;
        } else {
          item.data = args[0] || null;
        }
        vm.updateRequest(id, item);

        _send.apply(this, arguments);
      };

      XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        const xhr = this;
        const id = this.$id;
        const item = vm.requestMap[id] || {};
        item.requestHeaders = { ...item.requestHeaders, [header]: value };
        vm.updateRequest(id, item);

        _setRequestHeaders.apply(this, arguments);
      };
    },
    genUUID() {
      let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      return id;
    },
    updateRequest(id, item) {
      let _item = this.requestMap[id];

      if (_item) {
        this.$set(this.requestMap, id, { ..._item, ...item });
      } else {
        // 添加初始值，并拷贝新值
        const initValue = {
          isExpand: false,
          activeTab: "response",
          responseHeaders: {},
          requestHeaders: {}
        };
        this.$set(this.requestMap, id, { ...initValue, ...item });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../base.scss";

.network-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .head {
    flex: none;
    display: flex;
    flex-direction: row;
    height: $list-row-height;
    width: 100%;
    .cell {
      display: flex;
      width: 100%;
      height: 100%;
      background-color: $toolbar-bg-color;
      border-bottom: 1px solid $toolbar-border-color;
      border-left: 1px solid $toolbar-border-color;
      justify-content: left;
      padding: 0px 4px;
      align-items: center;
      flex: 1 1;
      .long {
        flex: 4 1;
        display: inline-block;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
      }
      &:first-child {
        border-left: none;
      }
      &:active {
        background-color: $toolbar-border-color;
      }
    }
  }
  .body {
    flex-grow: 1;
    overflow-y: scroll;
  }
  .foot {
    flex: none;
  }
}
</style>
