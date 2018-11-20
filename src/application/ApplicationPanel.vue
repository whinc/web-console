<template>
  <div class="application-panel">
    <VTabBar v-model="activeTab" :equalWidth="true">
      <VTabBarItem id="localStorage">Local Storage</VTabBarItem>
      <VTabBarItem id="sessionStorage">Session Storage</VTabBarItem>
      <VTabBarItem id="cookie">Cookies</VTabBarItem>
    </VTabBar>
    <!-- 使用同一个组件是为了共享部分视图状态 -->
    <TabStorage v-if="activeTab === 'localStorage' || activeTab === 'sessionStorage'" :storageType="activeTab" />
    <TabCookie v-else-if="activeTab === 'cookie'" />
  </div>
</template>

<script>
import { VTabBar, VTabBarItem } from "@/components";
import TabCookie from "./TabCookie";
import TabStorage from "./TabStorage";

export default {
  components: {
    VTabBar,
    VTabBarItem,
    TabCookie,
    TabStorage
  },
  data() {
    return {
      activeTab: "localStorage"
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../base.scss";

.application-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
}
</style>
