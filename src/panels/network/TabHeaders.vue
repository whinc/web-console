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

    <div v-if="sectionResponseHeaders.length > 0" class="section">
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

    <div v-if="sectionRequestHeaders.length > 0" class="section">
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

    <div v-if="sectionQueryStringParameters.length > 0" class="section">
      <div class="header">
        <div class="title">Query String Parameters</div>
      </div>
      <div class="body">
        <div class="line" v-for="item in sectionQueryStringParameters" :key="item.key">
          <span class="name">{{item.key}}: </span>
          <span class="source-code">{{item.value}}</span>
        </div>
      </div>
    </div>

    <div v-if="sectionRequestPayload.headers.length > 0" class="section">
      <div class="header">
        <div class="title">{{sectionRequestPayload.title}}</div>
      </div>
      <div class="body">
        <div class="line" v-for="item in sectionRequestPayload.headers" :key="item.key">
          <span v-if="item.key" class="name">{{item.key}}: </span>
          <span class="source-code">{{item.value}}</span>
        </div>
      </div>
    </div>

  </div>  
</template>

<script>
import URLSearchParams from "url-search-params";
import HttpStatus from "./HttpStatus";

export default {
  props: {
    requestInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    sectionGeneral() {
      const requestInfo = this.requestInfo;
      const arr = [];
      arr.push({ key: "Request URL", value: requestInfo.url });

      const status = requestInfo.status;
      const statusRange = parseInt(status / 100);
      if (statusRange === 2 || statusRange === 3 || statusRange === 4 || statusRange === 5) {
        arr.push({
          key: "Request Method",
          value: (requestInfo.method || "").toUpperCase()
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
      const requestHeaders = this.requestInfo.requestHeaders;
      return Object.keys(requestHeaders).reduce((arr, key) => {
        arr.push({ key, value: requestHeaders[key] });
        return arr;
      }, []);
    },
    sectionQueryStringParameters() {
      const url = this.requestInfo.url;
      if (!url) return [];

      const arr = [];
      const index = url.indexOf("?");
      if (index !== -1) {
        const searchPart = url.slice(index + 1);
        const params = new URLSearchParams(searchPart);
        for (let pair of params.entries()) {
          arr.push({ key: pair[0], value: pair[1] });
        }
      }
      return arr;
    },
    sectionRequestPayload() {
      const result = {
        title: "Request Payload",
        headers: []
      };

      const data = this.requestInfo.data;
      if (!data) return result;

      const requestHeaders = this.requestInfo.requestHeaders;
      const mimeType = (requestHeaders["Content-Type"] || "").split(";")[0].replace(/(^\s+)|(\s+$)/g, "");
      switch (mimeType) {
        case "application/x-www-form-urlencoded":
          result.title = "Form Data";
          const params = new URLSearchParams(data);
          for (let pair of params.entries()) {
            result.headers.push({
              key: decodeURIComponent(pair[0]),
              value: decodeURIComponent(pair[1])
            });
          }
          break;
        case "application/json":
          try {
            result.headers.push({ value: JSON.parse(data) });
          } catch (error) {
            result.headers.push({ value: data });
          }
          break;
        default:
          result.headers.push({ value: data });
          break;
      }

      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

.tab-headers {
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  color: rgb(33%, 33%, 33%);
  height: 75vw;
  overflow: scroll;
  .section {
    padding-bottom: 5px;
    border-bottom: solid 1px #e0e0e0;
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
