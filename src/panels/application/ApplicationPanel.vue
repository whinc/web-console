<template>
  <div class="application-panel">
    <VTabBar v-model="activeTab" :equalWidth="true">
      <VTabBarItem v-for="{type, desc} in storageTypes" :key="type"
        :id="type">
        {{desc}}
      </VTabBarItem>
    </VTabBar>
    <TabStorage v-for="{type} in storageTypes" :key="type"
      v-show="activeTab === type"
      :class="type"
      :storageType="type"
    />
  </div>
</template>

<script>
import { VTabBar, VTabBarItem } from "@/components";
import TabStorage from "./TabStorage";

export default {
  name: "ApplicationPanel",
  components: {
    VTabBar,
    VTabBarItem,
    TabStorage
  },
  data() {
    return {
      activeTab: "localStorage"
    };
  },
  computed: {
    storageTypes() {
      return [
        { type: "localStorage", desc: "Local Storage" },
        { type: "sessionStorage", desc: "Session Storage" },
        { type: "cookieStorage", desc: "Cookie" }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";

.application-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
}
</style>
