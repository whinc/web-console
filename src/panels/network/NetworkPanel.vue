<template>
  <div class="network-panel">
    <div class="head">
      <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">
        Name {{requestInfoList.length > 0 ? `(${requestInfoList.length})` : ''}}
      </span>
      <span class="cell">Method</span>
      <span class="cell">Status</span>
      <span class="cell">Type</span>
    </div>
    <div class="body" v-prevent-bkg-scroll>
      <NetworkRequest
        v-for="(requestInfo, index) in requestInfoList"
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
import { nextTick, Logger, eventBus, isFunction, uuid } from "@/utils";
import NetworkRequest from "./NetworkRequest";
import RequestType from "./RequestType";

const logger = new Logger("[NetworkPanel]");

const ReadyState = Object.freeze({
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
});

const DisplayStatus = Object.freeze({
  UNSENT: "-",
  PENDDING: "(pendding)",
  LOADING: "(loading)",
  FAIL: "fail"
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
      // 请求列表
      requestInfoMap: {
        /*
        * [id: number]: {
        *   id: string     // 请求编号(UUID)
        *   method: string // 请求方法
        *   url: string    // 请求地址
        *   requestHeaders: Object   // 请求 HTTP 头
        *   body: string   // 请求参数
        * 
        *   status: number // 状态码
        *   statusText: string // 状态码描述
        *   responseHeaders: Object  // 响应 HTTP 头
        *   responseText: string  // 响应数据
        * 
        *   displayStatus: string // 展示请求状态
        *   activeTab: string  // 请求详情当前激活的面板
        *   isExpand: boolean  // 是否展开请求详情
        * }
        */
      },
      // 选中的请求编号
      selectedId: ""
    };
  },
  computed: {
    // 展示的列表（后面会按时间或类型进行排序）
    requestInfoList() {
      return Object.keys(this.requestInfoMap).map(key => this.requestInfoMap[key]);
    },
    /* eslint-disable */
    footBarButtons() {
      return [
        {
          text: "Clear",
          click: () => {
            this.requestInfoMap = {};
          }
        },
        {
          text: "Hide",
          click: () => {
            eventBus.emit(eventBus.POPUP_HIDE);
          }
        }
      ];
    }
    /* eslint-enable */
  },
  mounted() {
    // 拦截 XMLHttpRequest
    this.hookXMLHttpRequest();

    // 拦截 fetch 请求
    this.hookFetch();
  },
  errorCaptured(error) {
    logger.error(error);
    return false;
  },
  methods: {
    onClickItem(id) {
      const item = this.requestInfoMap[id];
      // 点击同一行，切换展开态
      // 点击不同行，展开当前选中行，折叠之前选中行
      if (id === this.selectedId) {
        item.isExpand = !item.isExpand;
      } else {
        this.requestInfoMap[id].isExpand = true;
        if (this.requestInfoMap[this.selectedId]) {
          this.requestInfoMap[this.selectedId].isExpand = false;
        }
      }
      this.selectedId = id;
    },
    // 拦截 XMLHttpRequest 请求
    hookXMLHttpRequest() {
      const vm = this;
      const XMLHttpRequest = window.XMLHttpRequest;
      const _open = XMLHttpRequest.prototype.open;
      const _send = XMLHttpRequest.prototype.send;
      const _setRequestHeaders = XMLHttpRequest.prototype.setRequestHeader;

      XMLHttpRequest.prototype.open = function(method, url) {
        const xhr = this;
        const id = uuid();

        // 保存数据在 xhr 实例中，方便后续获取
        xhr.$id = id;
        xhr.$method = method;
        xhr.$url = url;
        xhr.$displayStatus = DisplayStatus.UNSENT;

        // 返回重写的 onreadystatechange 事件处理程序
        const getOnReadyStateChange = () => {
          const _onreadystatechange = xhr.onreadystatechange || function() {};
          return function(...args) {
            const requestInfo = vm.getRequestInfo(id);
            switch (xhr.readyState) {
              case ReadyState.UNSENT:
              case ReadyState.OPENED:
                // 在发送请求前，不会创建 requestInfo(避免显示到 UI 上)，此时如果状态变化，记录到 xhr 实例上，待发送后从实例上读取初始状态值创建 requestInfo 实例
                xhr.$displayStatus = DisplayStatus.PENDDING;
                break;
              case ReadyState.HEADERS_RECEIVED:
                requestInfo.displayStatus = DisplayStatus.LOADING;
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
                requestInfo.responseHeaders = responseHeaders;
                break;
              case ReadyState.LOADING:
                requestInfo.displayStatus = DisplayStatus.LOADING;
                break;
              case ReadyState.DONE:
                requestInfo.status = xhr.status;
                requestInfo.statusText = xhr.statusText;
                requestInfo.displayStatus = xhr.status;
                requestInfo.responseText = xhr.responseText;
                break;
              default:
                break;
            }

            vm.updateRequestInfo(id, requestInfo);

            _onreadystatechange.call(this, ...args);
          };
        };

        // 如果 open() 方法调用前，onreadystatechange 已注册，可以立即重写
        // 否则，在下一个微任务中重写，即等到用户注册后再执行
        if (isFunction(xhr.onreadystatechange)) {
          xhr.onreadystatechange = getOnReadyStateChange();
        } else {
          nextTick(() => {
            xhr.onreadystatechange = getOnReadyStateChange();
          });
        }

        _open.apply(this, arguments);
      };

      XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        const method = String(xhr.$method).toUpperCase();
        vm.addRequestInfo(xhr.$id, {
          type: RequestType.XHR,
          url: xhr.$url,
          method,
          displayStatus: xhr.$displayStatus,
          body: method === "GET" || method === "HEAD" ? null : body
        });

        _send.apply(this, arguments);
      };

      XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
        const xhr = this;
        const requestInfo = vm.getRequestInfo(xhr.$id);
        vm.updateRequestInfo(xhr.$id, {
          requestHeaders: {
            ...requestInfo.requestHeaders,
            [key]: value
          }
        });

        _setRequestHeaders.apply(this, arguments);
      };
    },
    // 拦截 fetch 请求
    hookFetch() {
      if (!isFunction(window.fetch)) return;

      const vm = this;
      // save original "fetch"
      const _fetch = window.fetch;
      window.fetch = function(...args) {
        // invoke original "fetch"
        const resultPromise = _fetch.call(this, ...args);

        // display request status
        const [input, init = {}] = args;
        const id = uuid();
        vm.addRequestInfo(id, {
          type: RequestType.FETCH,
          url: input,
          method: init.method
        });

        resultPromise.then(
          response => {
            return response.text().then(text => {
              const responseHeaders = {};
              for (const [key, value] of response.headers) {
                responseHeaders[key] = value;
              }
              vm.updateRequestInfo(id, {
                displayStatus: response.status,
                status: response.status,
                statusText: response.statusText,
                responseHeaders,
                responseText: text
              });
            });
          },
          err => {
            // network error
            vm.updateRequestInfo(id, {
              displayStatus: DisplayStatus.FAIL
            });
          }
        );

        // return result
        return resultPromise;
      };
    },
    addRequestInfo(
      id,
      {
        type,
        url,
        method,
        displayStatus = DisplayStatus.UNSENT,
        status = 0,
        statusText = "",
        body = null,
        requestHeaders = {},
        responseHeaders = {},
        isExpand = false,
        activeTab = "preview"
      }
    ) {
      if (type !== RequestType.XHR && type !== RequestType.FETCH) {
        throw new Error('invalid arguments "type":', type);
      }
      this.$set(this.requestInfoMap, id, {
        id,
        type,
        url,
        method,
        displayStatus,
        status,
        statusText,
        body,
        responseHeaders,
        requestHeaders,
        isExpand,
        activeTab
      });
    },
    updateRequestInfo(id, requestInfo) {
      this.$set(this.requestInfoMap, id, { ...(this.requestInfoMap[id] || {}), ...requestInfo });
    },
    getRequestInfo(id) {
      return this.requestInfoMap[id];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

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
      &.long {
        flex: 4 1;
        display: inline-block;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
        line-height: $list-row-height;
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
