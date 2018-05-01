<template>
  <div>
    <mt-button type="primary" class="entry" @click="showPanel">chrome console</mt-button>

    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <mt-tabbar v-model="tabId" :fixed="false" class="head">
          <mt-tab-item id="console">
            <span class="title">console</span>
          </mt-tab-item>
          <mt-tab-item id="network">
            <span class="title">network</span>
          </mt-tab-item>
        </mt-tabbar>
        <mt-tab-container v-model="tabId" class="body">
          <mt-tab-container-item id="console">
            <span>console</span>
          </mt-tab-container-item>
          <mt-tab-container-item id="network">
            <span>network</span>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import {Button, Popup, TabContainer, TabContainerItem, Tabbar, TabItem} from 'mint-ui'
export default {
  name: 'app',
  components: {
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Tabbar.name]: Tabbar,
    [TabItem.name]: TabItem,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
  },
  data () {
    return {
      panelVisible: false,
      tabId: 'console'
    }
  },
  methods: {
    showPanel () {
      this.panelVisible = true
    },
    hidePanel () {
      this.panelVisible = false
    }
  }
}
</script>

<style <style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.entry {
  position: fixed;
  right: 20px;
  bottom: 20px;
}

.panel {
  width: 100vw;
  height: 70vh;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.panel .head {
  position: static;
  height: 40px;
}
.panel .head .title {
  font-size: 20px;
}
.panel .body {
  flex-grow: 1;
}
</style>
