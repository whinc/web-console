<template>
  <div class="network-panel">
    <div class="table">
      <div class="row">
        <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">Name</span>
        <span class="cell">Method</span>
        <span class="cell">Status</span>
      </div>
      <div class="row" v-for="item in requestList" :key="item.id">
        <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">{{item.url}}</span>
        <span class="cell">{{item.method}}</span>
        <span class="cell">{{item.status}}</span>
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
import {TabBar, TabItem} from '../components'
export default {
  components: {
    TabItem,
    TabBar
  },
  data () {
    return {
      requestList: {}
    }
  },
  mounted () {
    this.hookXMLHttpRequest()

    var xhr = new window.XMLHttpRequest()
    xhr.open('GET', 'https://whinc.github.io/web-console/')
    xhr.send()
  },
  methods: {
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

        const _onreadystatechange = xhr.onreadystatechange || function() {};
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
        const item = vm.requestList[xhr.$id] || {}
        item.id = xhr.$id
        item.method = xhr.$method
        item.url = xhr.$url

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
        this.$set(this.requestList, id, item)
        return
      }

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

}

.table .row {
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.table .row .cell {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: left;
  padding: 0px 4px;
  align-items: center;
  flex: 1 1;
}

.table .row .cell.long {
  flex: 4 1;
  display: inline-block;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
  line-height: 30px;
}

.foot-bar {
  position: absolute;
  height: 39px;
  bottom: 0px;
  line-height: 39px;
  border-top: 1px solid #d9d9d9;
}
.foot-bar .item {
    width: 100%;
    height: 100%;
    background-color: white;
    outline: none;
    border: none;
    position: relative;
}
.foot-bar .item:active {
  background-color: rgba(0,0,0,.15);
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
