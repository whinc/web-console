import { eventBus, EventBus, isFunction } from "@/utils";
import pluginEvents from "./pluginEvents";

let id = 0;

const hostProxy = {
  echo() {
    console.log("echo in App.vue");
  },
  hidePanel() {
    eventBus.emit(eventBus.REQUEST_WEB_CONSOLE_HIDE);
  }
};

class PluginManager extends EventBus {
  constructor(...args) {
    super(...args);

    this._plugins = [
      /**
       *  {
       *    name: string,
       *    component: VueComponent,
       *    settings: Object
       *  }
       */
    ];
    this._isWebConsoleReady = false;
  }

  addPlugin(plugin) {
    const that = this;
    const pluginId = `web-console-plugin-${id++}`;

    this.on(pluginEvents.WEB_CONSOLE_READY, () => {
      this._isWebConsoleReady = true;
    });

    const injectedLifeCycleMethods = {
      // created 周期函数触发时，Vue 已完成事件部署
      created() {
        const vm = this;
        // 注册插件生命周期方法
        Object.keys(pluginEvents).forEach(event => {
          that.on(event, (...args) => {
            const fn = this[event];
            isFunction(fn) && fn.call(vm, hostProxy, ...args);
          });
        });
      }
    };
    const _plugin = {
      id: pluginId,
      name: plugin.name,
      component: {
        ...plugin.component,
        mixins: [injectedLifeCycleMethods],
        name: pluginId
      }
    };
    this._plugins.push(_plugin);
  }

  getPlugins() {
    return this._plugins;
  }

  toString() {
    return JSON.stringify(this._plugins, null, 4);
  }
}

export default new PluginManager();
