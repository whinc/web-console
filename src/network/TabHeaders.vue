<template>
  <div class="tab-headers">
    <div class="section">
      <div class="header">
        <div class="title">General</div>
      </div>
      <div class="body">
        <div class="line" v-for="item in sectionGeneral" :key="item.key">
          <span class="name">{{item.key}}: </span>
          <span class="source-code">
            <img v-if="item.icon" class="icon" :src="item.icon" />{{item.value}}
          </span>
        </div>
      </div>
    </div>

    <div class="divider" />

    <div class="section">
      <div class="header">
        <div class="title">Response Headers</div>
      </div>
      <div class="body">
        <div class="line" v-for="item in sectionResponseHeaders" :key="item.key">
          <span class="name">{{item.key}}: </span>
          <span class="source-code">{{item.value}}</span>
        </div>
      </div>
    </div>

    <div class="divider" />

    <div class="section">
      <div class="header">
        <div class="title">Request Headers</div>
      </div>
      <div class="body">
        <div class="line" v-for="item in sectionRequestHeaders" :key="item.key">
          <span class="name">{{item.key}}: </span>
          <span class="source-code">{{item.value}}</span>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import { HttpStatus } from "@/constants";

export default {
  props: {
    requestInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    sectionGeneral() {
      const arr = [];
      arr.push({ key: "Request URL", value: this.requestInfo.url });

      const status = this.requestInfo.status;
      const statusRange = parseInt(status / 100);
      if (
        statusRange === 2 ||
        statusRange === 3 ||
        statusRange === 4 ||
        statusRange === 5
      ) {
        arr.push({
          key: "Request Method",
          value: this.requestInfo.method.toUpperCase()
        });
        arr.push({
          key: "Status Code",
          value: `${status} ${HttpStatus[status]}`,
          icon: require(`@/assets/icons/${statusRange}xx.png`)
        });
      }
      return arr;
    },
    sectionResponseHeaders() {
      const responseHeaders = this.requestInfo.responseHeaders;
      return Object.keys(responseHeaders).reduce((arr, key) => {
        arr.push({
          key: key
            .split("-")
            .map(v => v[0].toUpperCase() + v.slice(1))
            .join("-"),
          value: responseHeaders[key]
        });
        return arr;
      }, []);
    },
    sectionRequestHeaders() {
      return [];
    },
    sectionQueryStringParams() {
      const url = this.requestInfo.url;
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../base";

.tab-headers {
  display: flex;
  flex-direction: column;
  color: rgb(33%, 33%, 33%);
  .divider {
    border-bottom: solid 1px #e0e0e0;
  }
  .section {
    padding-bottom: 5px;
    .header {
      display: flex;
      flex-direction: row;
      margin-top: 1px;
      line-height: $primary-font-size * 5 / 3;
      .title {
        font-weight: bold;
      }
    }
    .body {
      padding-left: 5px;
      .line {
        margin-top: 1px;
        min-height: $primary-font-size;
        line-height: $primary-font-size * 5 / 3;
        .name {
          font-weight: bold;
          margin-right: 0.25em;
          white-space: nowrap;
        }
        .icon {
          width: $primary-font-size * 4 / 5;
          height: $primary-font-size * 4 / 5;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
