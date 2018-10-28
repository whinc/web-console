<template>
  <div class="application-panel">
    <VTabBar v-model="activeTab" :equalWidth="true">
      <VTabBarItem id="cookie">Cookies</VTabBarItem>
      <VTabBarItem id="localStorage">Local Storage</VTabBarItem>
      <VTabBarItem id="sessionStorage">Session Storage</VTabBarItem>
    </VTabBar>
    <TabCookie v-show="activeTab === 'cookie'" />
    <TabLocalStorage v-show="activeTab === 'localStorage'" />
    <TabSessionStorage v-show="activeTab === 'sessionStorage'" />
  </div>
</template>

<script>
import { VTabBar, VTabBarItem } from "@/components";
import TabCookie from "./TabCookie";
import TabLocalStorage from "./TabLocalStorage";
import TabSessionStorage from "./TabSessionStorage";

export default {
  components: {
    VTabBar,
    VTabBarItem,
    TabCookie,
    TabLocalStorage,
    TabSessionStorage
  },
  data() {
    return {
      activeTab: "cookie"
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
