<template>
  <div class="request">
    <div class="summary" @click="$emit('click')" :class="{selected: isSelected, even: isEven, error: isStatusError(requestInfo)}">
      <span class="cell long" :style="{'max-width': `${4/6*100}vw`}">{{requestInfo.url}}</span>
      <span class="cell">{{requestInfo.method}}</span>
      <span class="cell">{{requestInfo.displayStatus}}</span>
      <span class="cell">{{requestInfo.type}}</span>
    </div>
    <div class="detail" v-if="requestInfo.isExpand">
      <v-tab-bar v-model="requestInfo.activeTab" :show-bottom-border="false">
        <v-tab-bar-item id="headers">Headers</v-tab-bar-item>
        <v-tab-bar-item id="preview">Preview</v-tab-bar-item>
        <v-tab-bar-item id="response">Response</v-tab-bar-item>
      </v-tab-bar>

      <TabHeaders
        v-show="requestInfo.activeTab === 'headers'"
        :requestInfo="requestInfo"
      />
      <TabPreview
        v-show="requestInfo.activeTab === 'preview'"
        :requestInfo="requestInfo"
      />
      <TabResponse
        v-show="requestInfo.activeTab === 'response'"
        :requestInfo="requestInfo"
      />
    </div>
  </div>
</template>

<script>
import { VTabBar, VTabBarItem } from "@/components";
import TabHeaders from "./TabHeaders";
import TabResponse from "./TabResponse";
import TabPreview from "./TabPreview";

export default {
  components: {
    [VTabBar.name]: VTabBar,
    [VTabBarItem.name]: VTabBarItem,
    TabHeaders,
    TabResponse,
    TabPreview
  },
  name: "NetworkRequest",
  props: {
    // 请求信息
    requestInfo: {
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
  methods: {
    isStatusError(requestInfo) {
      if (requestInfo.status >= 400 && requestInfo.status < 600) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";
@import "../../styles/mixins";

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
      @include descendant-attr("color", $status-error-color);
    }
    &.even {
      background-color: rgb(245, 245, 245);
    }
    &.selected {
      @include descendant-attr("color", white);
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
    .tab-container {
      background-color: white;
    }
  }
}
</style>
