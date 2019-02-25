import Vue from "vue";
import App from "./App.vue";
import "./polyfill";
import { consoleHooks, filters } from "@/utils";
// import { Logger } from "@/utils";
import infiniteScroll from "vue-infinite-scroll";
import "./styles/_global.scss";

// register filters
Object.keys(filters).forEach(name => {
  Vue.filter(name, filters[name]);
});

Vue.use(infiniteScroll);

// const logger = new Logger("[main.js]");

// 放在可滚动容器上，在滚动触顶或触底时，可以阻止背景层滚动
Vue.directive("prevent-bkg-scroll", {
  bind(el) {
    let preventMove = false;
    el.addEventListener("touchstart", function() {
      // logger.log('touchstart scrollTop: %s, clientHeight: %s, scrollHeight: %s', el.scrollTop, el.clientHeight, el.scrollHeight)
      if (el.scrollTop <= 0) {
        // 滚动到顶部时将其设置为 1，避免触顶后不能向下滚动(IOS 上 scrollTop 会出现负数)
        el.scrollTop = 1;
        // 如果内容不足一屏，则禁用 touchmove
        if (el.scrollTop === 0) {
          preventMove = true;
        }
      } else if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        // 滚动到底部时，将滚动距离设置为最大可滚动距离 - 1，避免触底后不能向上滚动
        el.scrollTop = el.scrollHeight - el.clientHeight - 1;
        // 如果内容不足一屏
        if (el.scrollTop + el.clientHeight === el.scrollHeight) {
          preventMove = true;
        }
      }
    });
    el.addEventListener("touchmove", function(e) {
      if (preventMove) {
        e.preventDefault();
      }
    });
    el.addEventListener("touchend", function() {
      preventMove = false;
    });
  }
});

Vue.config.productionTip = false;

// WebConsole 只能创建一个实例
let _webConsole = null;

class WebConsole {
  constructor(options) {
    if (_webConsole) {
      console.warn("WebConsole has been initialized, return previous instance: %O", _webConsole);
      return _webConsole;
    }

    _webConsole = this;
    this._defaultOptions = {
      panelVisible: false,
      activeTab: "console",
      entryStyle: "button"
    };
    this._load(options);
  }

  _load(options = {}) {
    // console.log("web-console start");
    if (document.readyState === "interactive" || document.readyState === "complete") {
      const root = document.createElement("div");
      (document.documentElement || document.body).appendChild(root);

      // console.log("web console shoule output me!!!");
      const defaultOptions = this._defaultOptions;
      const vm = new Vue({
        el: root,
        render: h =>
          h(App, {
            props: {
              initPanelVisible: options.panelVisible || defaultOptions.panelVisible,
              initActiveTab: options.activeTab || defaultOptions.activeTab,
              initEntryStyle: options.entryStyle || defaultOptions.entryStyle
            }
          })
      });
    } else {
      document.addEventListener("readystatechange", this._load.bind(this));
    }
  }
}

if (!window.WebConsole) {
  window.WebConsole = WebConsole;
  consoleHooks.install();
} else {
  console.error("Inject WebConsole into window failed");
}
export default WebConsole;
