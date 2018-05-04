<template>
  <div>
    <mt-button type="primary" class="entry" @click="showPanel">web-console</mt-button>

    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <!-- Tab -->
        <mt-tabbar v-model="tabId" :fixed="false" class="head">
          <mt-tab-item id="console">
            <span class="title">console</span>
          </mt-tab-item>
          <mt-tab-item id="network">
            <span class="title">network</span>
          </mt-tab-item>
        </mt-tabbar>
        <!-- Tab Container -->
        <mt-tab-container v-model="tabId">
          <mt-tab-container-item id="console" class="body">
            <console-panel />
          </mt-tab-container-item>
          <mt-tab-container-item id="network" class="body">
            <network-panel />
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import {Button, Popup, TabContainer, TabContainerItem, Tabbar, TabItem} from 'mint-ui'
import {ConsolePanel} from './Console'
import {NetworkPanel} from './Network'
export default {
  name: 'app',
  components: {
    ConsolePanel,
    NetworkPanel,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Tabbar.name]: Tabbar,
    [TabItem.name]: TabItem,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
  },
  data () {
    return {
      // 设置为 true 方便调试
      panelVisible: true,
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

<style scoped>
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
  font-family: monospace, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
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
  height: 70vh;
  overflow-y: scroll;
}
</style>
