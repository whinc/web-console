<template>
  <div class="application-panel">
    <div class="head">
      <VTabBar class="head__tabbar" v-model="activeTab" :equalWidth="true">
        <VTabBarItem v-for="{type, desc} in storageTypes" :key="type"
          :id="type">
          {{desc}}
        </VTabBarItem>
        <VIcon slot="icons" :name="isToolbarExpanded ? 'collapse' : 'expand'" class="head__icon" @click="isToolbarExpanded = !isToolbarExpanded" />
      </VTabBar>
      <!-- <div class="head__separator" /> -->
    </div>
    <TabStorage v-for="{type} in storageTypes" :key="type"
      v-show="activeTab === type"
      ref="tabStorage"
      class="body"
      :class="type"
      :storageType="type"
      :isToolbarExpanded="isToolbarExpanded"
    />
    <VFootBar class="foot" :buttons="buttons" />
  </div>
</template>

<script>
import { VTabBar, VTabBarItem, VFootBar, VIcon } from "@/components";
import { eventBus } from "@/utils";
import TabStorage from "./TabStorage";

export default {
  name: "ApplicationPanel",
  components: {
    VTabBar,
    VTabBarItem,
    TabStorage,
    VIcon,
    VFootBar
  },
  data() {
    return {
      activeTab: "localStorage",
      // 工具栏是否处于展开态
      isToolbarExpanded: false
    };
  },
  computed: {
    buttons() {
      return [
        {
          text: "Refresh",
          click: () => {
            // 刷新当前激活的 Stroage 数据
            const tabStorage = this.getActiveTabStorage();
            if (tabStorage) {
              tabStorage.onRefresh();
            }
          }
        },
        {
          text: "Clear",
          click: () => {
            // 清除当前激活的 Stroage 数据
            const tabStorage = this.getActiveTabStorage();
            if (tabStorage) {
              tabStorage.onClearAll();
            }
          }
        },
        {
          text: "Hide",
          click: () => {
            eventBus.emit(eventBus.POPUP_HIDE);
          }
        }
      ];
    },
    storageTypes() {
      return [
        { type: "localStorage", desc: "Local Storage" },
        { type: "sessionStorage", desc: "Session Storage" },
        { type: "cookieStorage", desc: "Cookie" }
      ];
    }
  },
  created() {
    // 监听"偏好设置"变化
    eventBus.on(eventBus.SETTINGS_CHANGE, this.onSettingsChanged.bind(this));
  },
  methods: {
    onSettingsChanged(settings) {
      this.isToolbarExpanded = settings.showApplicationToolbar;
    },
    // 获取当前激活的 TabStroage 组件实例
    getActiveTabStorage() {
      const tabStorageList = this.$refs.tabStorage;
      if (Array.isArray(tabStorageList)) {
        const foundIndex = tabStorageList.findIndex(v => v.storageType === this.activeTab);
        if (foundIndex !== -1) {
          return tabStorageList[foundIndex];
        }
      }
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.application-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .head {
    flex: 0 0 auto;
    display: flex;
    &__tabbar {
      flex: 1 1 auto;
    }
    &__icon {
      padding: 0.6em;
      width: 2.4em;
    }
  }
  .body {
    flex: 1 1 auto;
  }
  .foot {
    flex: 0 0 auto;
  }
}
</style>
