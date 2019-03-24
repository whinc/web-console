<template>
  <div class="request">
    <div class="row" @click="$emit('click')" :class="{selected: isSelected, even: isEven, error: isStatusError(requestInfo)}">
      <span class="cell cell--long" :style="{'max-width': `${4/6*100}vw`}">{{requestInfo.url}}</span>
      <span class="cell">{{requestInfo.method}}</span>
      <span class="cell">{{requestInfo.displayStatus}}</span>
      <span class="cell">{{requestInfo.type}}</span>
    </div>
    <div class="row-expand" v-if="requestInfo.isExpand">
      <VTabBar v-model="requestInfo.activeTab" :show-bottom-border="false">
        <VTabBarItem id="headers">Headers</VTabBarItem>
        <VTabBarItem id="preview">Preview</VTabBarItem>
        <VTabBarItem id="response">Response</VTabBarItem>
      </VTabBar>

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
    VTabBar,
    VTabBarItem,
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
      }
      if (requestInfo.status === -1) {
        return true;
      }

      return false;
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
  .row {
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
      &--long {
        flex: 4 1;
        display: inline-block;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
        line-height: $list-row-height;
      }
    }
  }
  .row-expand {
  }
}
</style>
