<template>
  <div class="network-panel">
    <div class="table">
      <div class="row">
        <div class="summary">
          <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">Name</span>
          <span class="cell">Method</span>
          <span class="cell">Status</span>
        </div>
      </div>
      <div class="row" v-for="item in requestList" :key="item.id">
        <div class="summary" @click="onClickItem(item.id)">
          <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">{{item.url}}</span>
          <span class="cell">{{item.method}}</span>
          <span class="cell">{{item.status}}</span>
        </div>
        <div class="detail" v-show="item.isExpand">
          <tab-bar :is-equal-width="false" :show-indicator="false" v-model="item.activeTab">
            <tab-item id="headers">Headers</tab-item>
            <tab-item id="response">Response</tab-item>
          </tab-bar>
          <!-- Tab Container -->
          <mt-tab-container v-model="item.activeTab">
            <mt-tab-container-item id="headers" class="tab-container">
              <h1>headers</h1>
            </mt-tab-container-item>
            <mt-tab-container-item id="response" class="tab-container">
              <h1>response</h1>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
    </div>
    <div class="message-list">
    </div>
    <tab-bar class="foot-bar">
      <tab-item>
        <button class="item" @click="onClickClear">Clear</button>
      </tab-item>
      <tab-item>
        <button class="item" @click="onClickHide">Hide</button>
      </tab-item>
    </tab-bar>
  </div>

</template>

<script>
import {TabContainer, TabContainerItem} from 'mint-ui'
import {TabBar, TabItem} from '../components'
export default {
  components: {
    TabItem,
    TabBar,
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
     * 
     * 参考：<http://javascript.ruanyifeng.com/bom/ajax.html>
     */
    hookXMLHttpRequest () {
      const vm = this
      const _open = window.XMLHttpRequest.prototype.open
      const _send = window.XMLHttpRequest.prototype.send

      window.XMLHttpRequest.prototype.open = function (method, url) {
        const xhr = this
        const id = vm.getUniqueID()

        xhr.$id = id
        xhr.$method = method
        xhr.$url = url

        const _onreadystatechange = xhr.onreadystatechange || function() {}
        xhr.onreadystatechange = function () {
          const item = vm.requestList[id] || {}

          item.readyState = xhr.readyState
          item.status = 0
          if (item.readyState >= 2) {
            item.status = xhr.status
          }

          vm.updateRequest(id, item)

          _onreadystatechange.apply(this, arguments)
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
        // add default properties to item, make them reactive
        item.isExpand = false
        item.activeTab = 'headers'
        this.$set(this.requestList, id, item)
        return
      }

      // update item
      Object.keys(item).forEach(key => _item[key] = item[key])
    }
  } 
}
</script>

<style scoped>
.network-panel {
  height: 100%;
  position: relative;
}

.table {
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 39px;
  overflow-y: scroll;
}

.table .row {
  display: flex;
  flex-direction: column;
}

.table .row .summary {
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.table .row .summary .cell {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: left;
  padding: 0px 4px;
  align-items: center;
  flex: 1 1;
}

.table .row .summary .cell.long {
  flex: 4 1;
  display: inline-block;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
  line-height: 30px;
}

.table .row .detail {

}


.foot-bar {
  position: absolute;
  height: 39px;
  bottom: 0px;
  line-height: 39px;
  border-top: 1px solid #d9d9d9;
  background-color: white;
}
.foot-bar .item {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 0px;
  outline: none;
  border: none;
  position: relative;
}
.foot-bar .item:active {
  background-color: rgba(0, 0, 0, .15);
}
.foot-bar .item::after{
    content: " ";
    position: absolute;
    top: .53846154em;
    bottom: .53846154em;
    right: 0;
    border-right: 1px solid #d9d9d9;
}
</style>
