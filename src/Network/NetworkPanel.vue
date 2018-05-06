<template>
  <div class="network-panel">
    <tab-bar class="head-bar" :show-indicator="false">
      <tab-item style="flex: 4 1" :style="{'max-width': `${4/6*100}vw`}">
        <span class="item long">Name</span>
      </tab-item>
      <tab-item style="flex: 1 1">
        <span class="item">Method</span>
      </tab-item>
      <tab-item style="flex: 1 1">
        <span class="item">Status</span>
      </tab-item>
    </tab-bar>
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
  methods: {
    onClickClear() {

    },
    onClickHide () {
      this.$root.$emit('hide')
    }
  } 
}
</script>

<style scoped>
.network-panel {
  height: 100%;
  position: relative;
}

.head-bar {
  height: 30px;
}

.head-bar .item {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: left;
  padding: 0px 4px;
  align-items: center;
}

.head-bar .item.long {
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
