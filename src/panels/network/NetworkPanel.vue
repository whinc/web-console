<template>
  <div class="network-panel">
    <!-- <VJSONViewer :value="value" /> -->
    <div class="head">
      <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">
        Name {{requestList.length > 0 ? `(${requestList.length})` : ''}}
      </span>
      <span class="cell">Method</span>
      <span class="cell">Status</span>
    </div>
    <div class="body" v-prevent-bkg-scroll>
      <NetworkRequest
        v-for="(requestInfo, index) in requestList"
        :key="requestInfo.id"
        :requestInfo="requestInfo"
        :is-selected="selectedId === requestInfo.id"
        :is-even="index % 2 === 0"
        @click="onClickItem(requestInfo.id)"
      />
    </div>
    <VFootBar :buttons="footBarButtons" class="foot" />
  </div>

</template>

<script>
import { VFootBar, VJSONViewer } from "@/components";
import { nextTick, Logger } from "@/utils";
import NetworkRequest from "./NetworkRequest";

const logger = new Logger("[NetworkPanel]");
const ReadyState = Object.freeze({
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

export default {
  name: "NetworkPanel",
  components: {
    VFootBar,
    VJSONViewer,
    NetworkRequest
  },
  data() {
    return {
      value: {
        a: 1,
        b: true,
        c: "c",
        d: [1.23, true, "c", { a: 1, b: 2 }],
        e: {
          a: 1,
          b: true,
          c: "c",
          d: null,
          e1: 1,
          e2: 1,
          e3: 1,
          e4: "a"
        }
      },
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
    /* eslint-disable */
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
    /* eslint-enable */
  },
  mounted() {
    this.hookXMLHttpRequest();
  },
  errorCaptured(error) {
    // 在浏览器控制台输出错误原因
    logger.error(error);
    return false;
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
        xhr.$method = typeof method === "string" ? method.toUpperCase() : method;
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
              case ReadyState.UNSENT:
                item.statusText = "(pending)";
                break;
              case ReadyState.OPENED:
                item.statusText = "(pending)";
                break;
              case ReadyState.HEADERS_RECEIVED:
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
              case ReadyState.LOADING:
                item.status = xhr.status;
                item.statusText = "(loading)";
                break;
              case ReadyState.DONE:
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
        const id = xhr.$id;
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
          activeTab: "preview",
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
@import "../../styles/variable";

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
