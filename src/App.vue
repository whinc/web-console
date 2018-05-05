<template>
  <div class="app">
    <mt-button type="primary" class="entry" @click="showPanel">web-console</mt-button>

    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <tab-bar class="tab-bar" v-model="activeTab" :show-indicator="false" :is-fixed-width="false">
          <tab-item id="console">
            <span class="item">Console</span>
          </tab-item>
          <tab-item id="network">
            <span class="item">Network</span>
          </tab-item>
        </tab-bar>
        <!-- Tab Container -->
        <mt-tab-container v-model="activeTab">
          <mt-tab-container-item id="console" class="tab-container">
            <console-panel />
          </mt-tab-container-item>
          <mt-tab-container-item id="network" class="tab-container">
            <network-panel />
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import {Button, Popup, TabContainer, TabContainerItem} from 'mint-ui'
import {TabBar, TabItem} from './components'
import {ConsolePanel} from './console'
import {NetworkPanel} from './network'
export default {
  name: 'app',
  components: {
    ConsolePanel,
    NetworkPanel,
    TabBar,
    TabItem,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
  },
  data () {
    return {
      // 设置为 true 方便调试
      panelVisible: true,
      activeTab: 'console'
    }
  },
  mounted (){
    this.$root.$on('hide', () => {
      this.hidePanel()
    })
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

/* Tab栏 */
.tab-bar {
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
}
.tab-bar .item {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  height: 100%;
}
.tab-bar .item:active {
  background-color: rgba(0,0,0,.15);
}
.tab-bar .item::after{
  content: " ";
  position: absolute;
  height: 100%;
  right: 0;
  border-right: 1px solid #d9d9d9;
}

.tab-container {
  height: 75vh;
}
</style>
