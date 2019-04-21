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
        <VTabBar v-model="activeTab">
          <VTabBarItem id="element">Element</VTabBarItem>
          <VTabBarItem id="console">Console</VTabBarItem>
          <VTabBarItem id="network">Network</VTabBarItem>
          <VTabBarItem id="application">Application</VTabBarItem>
          <!-- 插件 -->
          <VTabBarItem v-for="plugin in plugins" :key="plugin.id" :id="plugin.id">{{plugin.name}}</VTabBarItem> 
          <template slot="icons">
            <VIcon name="setting" @click="onClickSetting" style="width: 2em; padding: 0.4em" />
          </template>
        </VTabBar>
        <ElementPanel v-show="activeTab === 'element'" />
        <ConsolePanel v-show="activeTab === 'console'" />
        <NetworkPanel v-show="activeTab === 'network'" />
        <ApplicationPanel v-show="activeTab === 'application'" />
        <!-- 插件 -->
        <component
          v-for="plugin in plugins"
          :key="plugin.id"
          :id="plugin.id"
          class="plugin-panel"
          :is="plugin.component"
          v-show="activeTab === plugin.id"
        />
        <!-- 设置面板 -->
        <SettingsPanel v-model="isSettingPanelVisible" />
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Popup } from "mint-ui";
import { VTabBar, VTabBarItem, VIcon, VFootBar } from "@/components";
import { ApplicationPanel, ConsolePanel, SettingsPanel, NetworkPanel, ElementPanel } from "@/panels";
import { eventBus, Logger } from "@/utils";
import { pluginManager, pluginEvents } from "@/plugins";

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
    VFootBar,
    VTabBar,
    VTabBarItem,
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
    activeTab(newVal, oldVal) {
      // 触发 Tab 变化事件
      pluginManager.emit(pluginEvents.WEB_CONSOLE_TAB_CHANGED, newVal, oldVal);
    },
    panelVisible(value) {
      // 通知子元素弹窗可见性变化
      this.$nextTick(() => {
        eventBus.emit(eventBus.POPUP_VISIBILITY_CHANGE, value);
      });

      // 面板显示隐藏时，触发插件生命周期方法
      pluginManager.emit(value ? pluginEvents.WEB_CONSOLE_SHOW : pluginEvents.WEB_CONSOLE_HIDE);

      value ? this.scaleManager.preventScale() : this.scaleManager.recoverScale();
    },
    footBarButtons() {
      return [
        {
          text: "Clear",
          click: () => {
            this.msgList = [];
          }
        },
        {
          text: "Hide",
          click: () => {
            eventBus.emit(eventBus.REQUEST_WEB_CONSOLE_HIDE);
          }
        }
      ];
    }
  },
  beforeMount() {
    // 非 reactivity 数据
    this.scaleManager = createScaleManager();
    this.isTouched = false;

    // mounted 之前加载插件，确保 mounted 执行时插件已挂载
    this.installPlugins();

    // 监听请求隐藏主面板事件
    eventBus.on(eventBus.REQUEST_WEB_CONSOLE_HIDE, () => this.hidePanel());
    // 监听设置加载完毕事件，触发插件生命周期方法
    eventBus.on(eventBus.SETTINGS_LOADED, settings =>
      pluginManager.emit(pluginEvents.WEB_CONSOLE_SETTINGS_LOADED, settings)
    );
    // 监听设置变化事件，触发插件生命周期方法
    eventBus.on(eventBus.SETTINGS_CHANGE, settings =>
      pluginManager.emit(pluginEvents.WEB_CONSOLE_SETTINGS_CHANGED, settings)
    );
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

    // 触发插件 onWebConsoleReady 事件
    // 设置加载是在 beforeMount 中完成的，当主面板 mounted 时，设置项已经可用并且主面板也已经渲染完成，可以安全的告诉插件一切就绪
    pluginManager.emit(pluginEvents.WEB_CONSOLE_READY);
    // 如果主面板默认处于可见状态，则立即触发插件 onWebConsoleShow 周期方法
    if (this.panelVisible) {
      pluginManager.emit(pluginEvents.WEB_CONSOLE_SHOW);
    }
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
