<template>
  <div class="web-console">
    <!-- 悬浮按钮 -->
    <mt-button type="primary" class="entry" @click="showPanel">web-console</mt-button>

    <!-- 工具面板 -->
    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <tab-bar class="header-bar" v-model="activeTab" :show-indicator="false" :is-equal-width="false">
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
// 全局样式
.web-console {
  font-size: 15px;
  font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .source-code {
    font-family: Consolas, monospace;
  }

  // 使用IE盒模型
  & >>> * {
    box-sizing: border-box;
  }
}

</style>


<style scoped lang="scss">

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
  .item::after{
    content: " ";
    position: absolute;
    height: 100%;
    right: 0;
    border-right: 1px solid #d9d9d9;
  }
}

.tab-container {
  height: 75vh;
}
</style>
