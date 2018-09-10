import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

const load = options => {
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    const root = document.createElement("div");
    document.body.appendChild(root);

    let vm = new Vue({
      el: root,
      render: h =>
        h(App, {
          props: {
            initPanelVisible: options.panelVisible || false,
            initActiveTab: options.activeTab || "console",
            initEntryStyle: options.entryStyle || "button"
          }
        })
    });
  } else {
    document.addEventListener("readystatechange", load);
  }
};

let isInit = false;

const WebConsole = {
  init(options = {}) {
    if (isInit) {
      console.warn("WebConsole can only be initialize once");
      return;
    }

    load(options);
    isInit = true;
  }
};

// 注入到全局对象
if (!window["web-console"]) {
  window["web-console"] = WebConsole;
}

export default WebConsole;
