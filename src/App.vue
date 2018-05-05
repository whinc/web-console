<template>
  <div class="app">
    <mt-button type="primary" class="entry" @click="showPanel">web-console</mt-button>

    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <!-- Tab -->
        <mt-tabbar v-model="tabId" :fixed="false" class="tab-bar">
          <mt-tab-item id="console">
            <span class="title">Console</span>
          </mt-tab-item>
          <mt-tab-item id="network">
            <span class="title">Network</span>
          </mt-tab-item>
        </mt-tabbar>
        <!-- Tab Container -->
        <mt-tab-container v-model="tabId">
          <mt-tab-container-item id="console" class="tab-container">
            <console-panel />
          </mt-tab-container-item>
          <mt-tab-container-item id="network" class="tab-container">
            <network-panel />
          </mt-tab-container-item>
        </mt-tab-container>

        <div class="toolbar">
          <div>
            <button>Clear</button>
            <button>Hide</button>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import {Button, Popup, TabContainer, TabContainerItem, Tabbar, TabItem} from 'mint-ui'
import {ConsolePanel} from './console'
import {NetworkPanel} from './network'
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

.app {
  font-size: 14px;
  font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app >>> * {
  box-sizing: border-box;
}

.entry { 
  position: fixed;
  right: 20px;
  bottom: 20px;
}

.panel {
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.tab-bar {
  position: static;
  height: 40px;
}
.tab-bar .title {
  font-size: 14px;
}
.tab-container {
  height: 75vh;
}

.toolbar {
}
</style>
