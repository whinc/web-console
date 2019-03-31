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
      <div class="panel" :style="{'padding': `0 ${scrollbarWidth / 2}px`}">
        <!-- Tabbar -->
        <v-tab-bar v-model="activeTab">
          <v-tab-bar-item id="element">Element</v-tab-bar-item>
          <v-tab-bar-item id="console">Console</v-tab-bar-item>
          <v-tab-bar-item id="network">Network</v-tab-bar-item>
          <v-tab-bar-item id="application">Application</v-tab-bar-item>
          <!-- 插件 -->
          <v-tab-bar-item v-for="plugin in plugins" :key="plugin.id" :id="plugin.id">{{plugin.name}}</v-tab-bar-item> 
          <template slot="icons">
            <VIcon name="setting" @click="onClickSetting" style="width: 2em; padding: 0.4em" />
          </template>
        </v-tab-bar>
        <ElementPanel v-show="activeTab === 'element'" />
        <ConsolePanel v-show="activeTab === 'console'" />
        <NetworkPanel v-show="activeTab === 'network'" />
        <ApplicationPanel v-show="activeTab === 'application'" />
        <!-- 插件 -->
        <div v-for="plugin in plugins" :key="plugin.id" :data-name="plugin.name" class="plugin-panel" v-show="activeTab === plugin.id">
          <component :is="plugin.component" />
        </div>
        <!-- 设置面板 -->
        <SettingsPanel v-model="isSettingPanelVisible" />
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from "mint-ui";
import { VTabBar, VTabBarItem, VIcon } from "@/components";
import { ApplicationPanel, ConsolePanel, SettingsPanel, NetworkPanel, ElementPanel } from "@/panels";
import { eventBus, Logger } from "@/utils";
import { pluginManager } from "@/plugins";

const logger = new Logger("[App]");

logger.log("pluginManager:", pluginManager);

export default {
  name: "app",
  components: {
    ElementPanel,
    ConsolePanel,
    NetworkPanel,
    ApplicationPanel,
    SettingsPanel,
    VIcon,
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    [Popup.name]: Popup
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
      bottom: 20,
      // 页面右侧滚动条宽度，通过判断滚动条宽度，在页面右侧填充适当空间，修复 PC 端滚动条覆盖面板右侧边缘的问题
      scrollbarWidth: 0,
      plugins: []
    };
  },
  watch: {
    panelVisible(value) {
      // 通知子元素弹窗可见性变化
      this.$nextTick(() => {
        eventBus.emit(eventBus.POPUP_VISIBILITY_CHANGE, value);
      });
      value ? this.scaleManager.preventScale() : this.scaleManager.recoverScale();
    }
  },
  beforeMount() {
    // 非 reactivity 数据
    this.scaleManager = createScaleManager();
    this.isTouched = false;
  },
  mounted() {
    // 设置初始值
    this.panelVisible = this.initPanelVisible;
    this.initPanelVisible ? this.scaleManager.preventScale() : this.scaleManager.recoverScale();
    this.activeTab = this.initActiveTab;
    this.entryStyle = this.initEntryStyle;

    // 获取滚动条宽度
    this.scrollbarWidth = getScrollbarWidth();
    window.addEventListener("resize", () => {
      this.scrollbarWidth = getScrollbarWidth();
    });

    // 监听来自子元素的事件：请求隐藏弹窗
    eventBus.on(eventBus.REQUEST_WEB_CONSOLE_HIDE, () => this.hidePanel());

    // 加载插件
    this.installPlugins();
  },
  methods: {
    showPanel() {
      if (!this.panelVisible) {
        this.panelVisible = true;
        eventBus.emit(eventBus.WEB_CONSOLE_SHOW);
      }
    },
    hidePanel() {
      if (this.panelVisible) {
        this.panelVisible = false;
        eventBus.emit(eventBus.WEB_CONSOLE_HIDE);
      }
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
      this.isSettingPanelVisible = true;
    },
    installPlugins() {
      this.plugins = pluginManager.getPlugins();
    }
  }
};

// 管理页面缩放行为
function createScaleManager() {
  let onTouchStart = function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };
  let lastTouchEnd = 0;
  let onTouchEnd = function(event) {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };
  // 由于 IOS 10 以后通过 <meta> 标签无法禁止 safari 页面缩放，解决办法是通过 JS 判断缩放和双击事件来阻止页面缩放行为
  return {
    preventScale: () => {
      logger.log("preventScale");
      document.documentElement.addEventListener("touchstart", onTouchStart, true);
      document.documentElement.addEventListener("touchend", onTouchEnd, true);
    },
    recoverScale: () => {
      logger.log("recoverScale");
      document.documentElement.removeEventListener("touchstart", onTouchStart, true);
      document.documentElement.removeEventListener("touchend", onTouchEnd, true);
    }
  };
}

// 获取页面滚动条宽度
// 参考：[通过 JS 判断页面是否有滚动条的简单方法](https://www.cnblogs.com/nzbin/p/8117535.html)
function getScrollbarWidth() {
  var scrollDiv = document.createElement("div");
  scrollDiv.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;";
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}
</script>

<style scoped lang="scss">
@import "./styles/variables";
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
  box-sizing: border-box;
}

.plugin-panel {
  height: $panel-height;
}
</style>
