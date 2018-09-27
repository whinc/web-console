<template>
  <div class="request">
    <div class="summary" @click="$emit('click')" :class="{selected: isSelected, even: isEven, error: isStatusError(item)}">
      <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">{{item.url}}</span>
      <span class="cell">{{item.method}}</span>
      <span class="cell">{{item.statusText}}</span>
    </div>
    <div class="detail" v-show="item.isExpand">
      <v-tab-bar v-model="item.activeTab" :show-bottom-border="false">
        <v-tab-bar-item id="headers">Headers</v-tab-bar-item>
        <v-tab-bar-item id="response">Response</v-tab-bar-item>
      </v-tab-bar>
      <!-- Tab Container -->
      <mt-tab-container v-model="item.activeTab" style="background-color: white">
        <mt-tab-container-item id="headers" class="content">
          <TabHeaders :requestInfo="item" />
        </mt-tab-container-item>
        <mt-tab-container-item id="response" class="tab-container">
          <TabResponse :contentType="contentType" :content="item.response" />
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
import { TabContainer, TabContainerItem } from "mint-ui";
import { VTabBar, VTabBarItem } from "@/components";
import TabHeaders from "./TabHeaders";
import TabResponse from "./TabResponse";

export default {
  components: {
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    [TabContainer.name]: TabContainer,
    [TabContainerItem.name]: TabContainerItem,
    TabHeaders,
    TabResponse
  },
  name: "NetworkRequest",
  props: {
    item: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    isEven: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    contentType() {
      return this.item.responseHeaders["content-type"];
    }
  },
  methods: {
    isStatusError(item) {
      if (item.status >= 400 && item.status < 600) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../base.scss";

$status-error-color: rgb(230, 0, 0);
.request {
  display: flex;
  flex-direction: column;
  .summary {
    width: 100%;
    height: $list-row-height;
    display: flex;
    flex-direction: row;
    align-items: center;
    &.error {
      color: $status-error-color;
    }
    &.even {
      background-color: rgb(245, 245, 245);
    }
    &.selected {
      color: white;
      background-color: #2196f3;
    }
    .cell {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: left;
      padding: 0px 4px;
      align-items: center;
      flex: 1 1;
      &.long {
        flex: 4 1;
        display: inline-block;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
        line-height: $list-row-height;
      }
    }
  }
  .detail {
    .head {
      background-color: rgba($toolbar-bg-color, 0.5);
      color: $tab-fg-color;
      border-bottom: 1px solid rgba($toolbar-border-color, 0.5);
      .tab-item {
        background-color: rgba(0, 0, 0, 0);
        &.selected {
          color: $tab-selected-fg-color;
        }
      }
    }
    .content {
      max-height: 40vh;
      overflow-y: scroll;
      padding: 2px 5px;
    }
  }
}
</style>
