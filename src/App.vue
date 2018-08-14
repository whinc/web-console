<template>
  <div class="web-console">
    <!-- 悬浮按钮 -->
    <mt-button type="primary" class="entry" @click="showPanel">web-console</mt-button>

    <!-- 工具面板 -->
    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <v-tab-bar style="border-bottom: 1px solid rgb(205, 205, 205)" v-model="activeTab">
          <v-tab-bar-item id="console">Console</v-tab-bar-item>
          <v-tab-bar-item id="network">Network</v-tab-bar-item>
        </v-tab-bar>
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
import {VTabBar, VTabBarItem} from './components'
import {ConsolePanel} from './console'
import {NetworkPanel} from './network'
export default {
  name: 'app',
  components: {
    ConsolePanel,
    NetworkPanel,
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
  },
  props: {
    initPanelVisible: Boolean,
    initActiveTab: String
  },
  data () {
    return {
      panelVisible: false,
      activeTab: 'console'
    }
  },
  mounted (){
    // 设置初始值
    this.panelVisible = this.initPanelVisible
    this.activeTab = this.initActiveTab

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

<style lang="scss">
@import './base.scss';

// 全局样式
.web-console {
  font-size: $primary-font-size;
  font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(48, 57, 66);
  .source-code {
    font-size: $source-code-font-size !important;
    font-family: Menlo, Consolas, monospace;
  }

  // 使用IE盒模型
  & >>> * {
    box-sizing: border-box;
  }
}

</style>


<style scoped lang="scss">
@import './base.scss';
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
.header-bar {
  height: 40px !important;
  border-bottom: 1px solid #d9d9d9;
  background-color: $toolbar-bg-color;
  .tab-item {
    color: $tab-fg-color;
    background-color: rgba(0, 0, 0, 0);
    &.selected {
      color: $tab-selected-fg-color;
    }
  }
}

.tab-container {
  height: 75vh;
}
</style>
