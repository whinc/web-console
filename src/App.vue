<template>
  <div class="web-console">
    <!-- 悬浮按钮 -->
    <template v-if="!panelVisible">
      <img
        v-if="entryStyle === 'icon'"
        class="entry icon"
        :style="{right: right + 'px', bottom: bottom + 'px'}"
        src="@/assets/icons/chrome_logo.png"
        @click="showPanel"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      />
      <button
        v-else
        class="entry button"
        :style="{right: right + 'px', bottom: bottom + 'px'}"
        @click="showPanel"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        web-console
      </button>
    </template>

    <!-- 工具面板 -->
    <mt-popup position="bottom" v-model="panelVisible">
      <div class="panel">
        <!-- Tabbar -->
        <v-tab-bar v-model="activeTab">
          <v-tab-bar-item id="console">Console</v-tab-bar-item>
          <v-tab-bar-item id="network">Network</v-tab-bar-item>
          <template slot="icons">
            <VIcon name="setting" @click="onClickSetting" />
          </template>
        </v-tab-bar>
        <!-- Tab Container -->
        <mt-tab-container v-model="activeTab">
          <mt-tab-container-item id="console">
            <console-panel />
          </mt-tab-container-item>
          <mt-tab-container-item id="network">
            <network-panel />
          </mt-tab-container-item>
        </mt-tab-container>
        <!-- 设置面板 -->
        <SettingsPanel v-model="isSettingPanelVisible" />
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, TabContainer, TabContainerItem } from "mint-ui";
import { VTabBar, VTabBarItem, VIcon } from "./components";
import { ConsolePanel } from "./console";
import { NetworkPanel } from "./network";
import { SettingsPanel } from "./settings";
import { eventBus } from "@/utils";
export default {
  name: "app",
  components: {
    ConsolePanel,
    NetworkPanel,
    SettingsPanel,
    VIcon,
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    [Popup.name]: Popup,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem
  },
  props: {
    initPanelVisible: Boolean,
    initActiveTab: String,
    // 入口样式，支持 'icon' 和 'button'
    initEntryStyle: String
  },
  data() {
    return {
      entryStyle: "icon",
      panelVisible: false,
      isSettingPanelVisible: false,
      activeTab: "console",
      right: 20,
      bottom: 20
    };
  },
  watch: {
    panelVisible(value) {
      // 通知子元素弹窗可见性变化
      this.$nextTick(() => {
        eventBus.emit(eventBus.POPUP_VISIBILITY_CHANGE, value);
      });
    }
  },
  mounted() {
    // 设置初始值
    this.panelVisible = this.initPanelVisible;
    this.activeTab = this.initActiveTab;
    this.entryStyle = this.initEntryStyle;

    this.isTouched = false;

    // 监听来自子元素的事件：请求隐藏弹窗
    eventBus.on(eventBus.POPUP_HIDE, () => this.hidePanel());
  },
  methods: {
    showPanel() {
      this.panelVisible = true;
    },
    hidePanel() {
      this.panelVisible = false;
    },
    onTouchStart(e) {
      this.isTouched = true;
      const touch = e.changedTouches[0];
      this.prevClientX = touch.clientX;
      this.prevClientY = touch.clientY;
    },
    onTouchMove(e) {
      if (!this.isTouched) return;
      const touch = e.changedTouches[0];
      this.right -= touch.clientX - this.prevClientX;
      this.bottom -= touch.clientY - this.prevClientY;
      // 防止滑出边界
      this.right = Math.min(Math.max(this.right, 0), document.documentElement.clientWidth - e.target.clientWidth - 1);
      this.bottom = Math.min(Math.max(this.bottom, 0), document.documentElement.clientHeight - e.target.clientHeight);
      this.prevClientX = touch.clientX;
      this.prevClientY = touch.clientY;

      // 避免滚动底层元素
      e.preventDefault();
    },
    onTouchEnd() {
      this.isTouched = false;
    },
    onClickSetting() {
      //       alert(`package name: ${process.env.VUE_APP_NAME}
      // version: ${process.env.VUE_APP_VERSION}
      // date: ${process.env.VUE_APP_DATE}`);
      this.isSettingPanelVisible = true;
    }
  }
};
</script>

<style lang="scss">
@import "./base.scss";

// 全局样式
.web-console {
  font-size: $primary-font-size;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(48, 57, 66);
  .source-code {
    font-size: $source-code-font-size !important;
    font-family: Menlo, Consolas, monospace;
  }

  * {
    box-sizing: border-box;
  }

  pre {
    margin: 0;
  }
}
</style>


<style scoped lang="scss">
@import "./base.scss";
.entry {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 99999;
  &.icon {
    border-radius: 16px;
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  }
  &.button {
    font-size: 1em;
    font-weight: bold;
    padding: 0.6em 1em;
    border-radius: 0.3em;
    background-color: #26a2ff;
    color: white;
    outline: none;
    border: none;
    box-shadow: 0 0 0.61538462em rgba(0, 0, 0, 0.4);
  }
}

.panel {
  position: relative;
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
}
</style>
