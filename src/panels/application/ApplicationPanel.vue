<template>
  <div class="application-panel">
    <VTabBar class="head" v-model="activeTab" :equalWidth="true">
      <VTabBarItem v-for="{type, desc} in storageTypes" :key="type"
        :id="type">
        {{desc}}
      </VTabBarItem>
    </VTabBar>
    <TabStorage v-for="{type} in storageTypes" :key="type"
      v-show="activeTab === type"
      class="body"
      :class="type"
      :storageType="type"
    />
    <VFootBar class="foot" :buttons="buttons" />
  </div>
</template>

<script>
import { VTabBar, VTabBarItem, VFootBar } from "@/components";
import { eventBus } from "@/utils";
import TabStorage from "./TabStorage";

export default {
  name: "ApplicationPanel",
  components: {
    VTabBar,
    VTabBarItem,
    TabStorage,
    VFootBar
  },
  data() {
    return {
      activeTab: "localStorage"
    };
  },
  computed: {
    buttons() {
      return [
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
  }
};
</script>

<style lang="scss" scoped>
@import "../../base.scss";

.application-panel {
  height: $panel-height;
  display: flex;
  flex-direction: column;
  .head {
    flex: 0 0 auto;
  }
  .body {
    flex: 1 1 auto;
  }
  .foot {
    flex: 0 0 auto;
  }
}
</style>
