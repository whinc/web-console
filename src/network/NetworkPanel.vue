<template>
  <div class="network-panel">
    <div class="table">
      <div class="head">
          <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">Name</span>
          <span class="cell">Method</span>
          <span class="cell">Status</span>
      </div>
      <div class="row" v-for="item in requestList" :key="item.id">
        <div class="summary" @click="onClickItem(item.id)">
          <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">{{item.url}}</span>
          <span class="cell">{{item.method}}</span>
          <span class="cell">{{item.statusText}}</span>
        </div>
        <div class="detail" v-show="item.isExpand">
          <tab-bar class="head" :is-equal-width="false" :show-indicator="false" v-model="item.activeTab">
            <tab-item id="headers">Headers</tab-item>
            <tab-item id="response">Response</tab-item>
          </tab-bar>
          <!-- Tab Container -->
          <mt-tab-container v-model="item.activeTab">
            <mt-tab-container-item id="headers" class="content">
              <http-header
                v-for="(value, header) in item.headerMap"
                :key="header"
                :name="header"
                :value="value"
              />
            </mt-tab-container-item>
            <mt-tab-container-item id="response" class="tab-container">
              <http-response :value="item.response" />
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
    </div>
    <div class="message-list">
    </div>
    <my-foot-bar>
      <my-button @click="onClickClear">Clear</my-button>
      <my-foot-separator/>
      <my-button @click="onClickHide">Hide</my-button>
    </my-foot-bar>
  </div>

</template>

<script>
import {TabContainer, TabContainerItem} from 'mint-ui'
import {TabBar, TabItem, MyFootBar, MyButton, MyFootSeparator} from '@/components'
import {nextTick} from '@/utils'
import HttpHeader from './HttpHeader'
import HttpResponse from './HttpResponse'

export default {
  components: {
    TabItem,
    TabBar,
    MyFootBar,
    MyFootSeparator,
    MyButton,
    HttpHeader,
    HttpResponse,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
  },
  data () {
    return {
      requestList: {}
    }
  },
  mounted () {
    this.hookXMLHttpRequest()
  },
  methods: {
    onClickItem (id) {
      const item = this.requestList[id]
      item.isExpand = !item.isExpand
    },
    onClickClear() {

    },
    onClickHide () {
      this.$root.$emit('hide')
    },
    /**
     * 拦截 XMLHttpRequest 请求并记录状态
     */
    hookXMLHttpRequest () {
      const vm = this
      const _open = window.XMLHttpRequest.prototype.open
      const _send = window.XMLHttpRequest.prototype.send

      window.XMLHttpRequest.prototype.open = function (method, url) {
        const xhr = this
        const id = vm.getUniqueID()

        // 保存数据在 xhr 实例中，方便后续获取
        xhr.$id = id
        xhr.$method = method
        xhr.$url = url

        // 返回重写的 onreadystatechange 事件处理程序
        const getOverrideHandler = () => {
          // 监听请求状态变化，并更新视图状态
          const _onreadystatechange = xhr.onreadystatechange || function () {}
          return function () {
            console.log('[NetworkPanel] %s ready state: %s', url, xhr.readyState)
            const item = vm.requestList[id] || {}

            item.readyState = xhr.readyState
            item.status = 0
            item.statusText = '-'
            item.responseType = xhr.responseType
            switch (xhr.readyState) {
              case 0: // UNSENT
                item.statusText = '(pending)'
                break
              case 1: // OPENED
                item.statusText = '(pending)'
                break
              case 2: // HEADERS_RECEIVED
                item.status = xhr.status
                item.statusText = '(loading)'
                const headers = xhr.getAllResponseHeaders()
                const headerArr = headers.split(/[\r\n]+/)
                headerArr.forEach(line => {
                  if (!line) return
                  const parts = line.split(': ')
                  const header = parts.shift()
                  const value = parts.join(': ')
                  item.headerMap[header] = value
                })
                break
              case 3: // LOADING
                item.status = xhr.status
                item.statusText = '(loading)'
                break
              case 4: // DONE
                item.status = xhr.status
                item.statusText = xhr.status
                item.response = xhr.response
                break
              default:
                break
            }

            vm.updateRequest(id, item)

            _onreadystatechange.apply(this, arguments)
          }
        }

        // 如果 open() 方法调用前，onreadystatechange 已注册，可以立即重写
        // 否则，在下一个微任务中重写，即等到用户注册后再执行
        if (typeof xhr.onreadystatechange === 'function') {
          xhr.onreadystatechange = getOverrideHandler()
        } else {
          nextTick(() => {
            xhr.onreadystatechange = getOverrideHandler()
          })
        }

        _open.apply(this, arguments)
      }


      window.XMLHttpRequest.prototype.send = function (...args) {
        const xhr = this
        const id = xhr.$id
        const item = vm.requestList[id] || {}
        item.id = id
        item.method = xhr.$method
        item.url = xhr.$url
        vm.updateRequest(id, item)

        _send.apply(this, arguments)
      }
    },
    getUniqueID() {
      let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
          return v.toString(16)
      })
      return id
    },
    updateRequest (id, item) {
      const _item = this.requestList[id]
      if(!_item) {
        /* 添加新元素时声明所有需要用到的字段，使这些字段变为 reactive，后续就可以直接更新字段值 */
        item.isExpand = false
        item.activeTab = 'headers'
        item.headerMap = {}
        this.$set(this.requestList, id, item)
        return
      }

      Object.keys(item).forEach(key => _item[key] = item[key])
    }
  } 
}
</script>

<style lang="scss" scoped>
@import '../base.scss';

.network-panel {
  height: 100%;
  position: relative;

  .table {
    position: absolute;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 39px;
    overflow-y: scroll;
    .head {
      display: flex;
      flex-direction: row;
      height: 30px;
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
          line-height: 30px;
        }
        &:first-child {
          border-left: none;
        }
        &:active {
          background-color: $toolbar-border-color;
        }
      }

    }

    .row {
      display: flex;
      flex-direction: column;
      .summary {
        height: 30px;
        width: 100%;
        display: flex;
        flex-direction: row;
        .cell {
          display: flex;
          width: 100%;
          height: 100%;
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
            line-height: 30px;
          }
        }
      }
      .detail {
        .head {
          background-color: rgba($toolbar-bg-color, 0.5);
          color: $tab-fg-color;
          border-bottom: 1px solid rgba($toolbar-border-color, 0.5);
          .tab-item {
            background-color: rgba(0, 0, 0, 0);
            &.selected {
              color: $tab-selected-fg-color;
            }
          }
        }
        .content {
          max-height: 40vh;
          overflow-y: scroll;
          padding: 2px 5px;
        }
      }
    }
  }

}

</style>
