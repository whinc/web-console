<template>
  <div class="tab-headers">
    <div class="section">
      <div class="header">
        <div class="title">General</div>
      </div>
      <div class="body">
        <div class="line" v-for="item in sectionGeneral" :key="item.key">
          <span class="name">{{item.key}}: </span>
          <span class="source-code">{{item.value}}</span>
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
export default {
  props: {
    requestInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    sectionGeneral() {
      return [
        { key: "Request URL", value: this.requestInfo.url },
        { key: "Request Method", value: this.requestInfo.method.toUpperCase() },
        { key: "Status Code", value: this.requestInfo.status }
      ];
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
      }
    }
  }
}
</style>
