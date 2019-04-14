import { eventBus, EventBus, isFunction } from "@/utils";
import { VFootBar } from "@/components";
import pluginEvents from "./pluginEvents";

let id = 0;

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
    // this._isWebConsoleReady = false;
    // 当前最新设置
    this._settings = {};

    this._hostProxy = {
      echo: () => console.log("echo in App.vue"),
      hidePanel: () => eventBus.emit(eventBus.REQUEST_WEB_CONSOLE_HIDE),
      getSettings: () => this._settings
    };

    const pluginMgr = this;
    const mixins = {
      components: {
        VFootBar
      },
      // created 周期函数触发时，Vue 已完成事件部署
      created() {
        const vm = this;
        // 注册插件生命周期方法
        // 当接收到特定事件时，自动触发相应的插件生命周期方法
        Object.keys(pluginEvents)
          .map(key => pluginEvents[key])
          .forEach(event => {
            pluginMgr.on(event, (...args) => {
              const fn = vm[event];
              if (isFunction(fn)) {
                fn.call(vm, pluginMgr._hostProxy, ...args);
              }
            });
          });
      } // created
    };
    this._mixins = mixins;
  }

  /**
   * 注册插件
   * @param {Object} plugin
   * @param {Object} plugin.component 插件内容，是一个 Vue 组件
   */
  addPlugin(plugin) {
    const { name, component, settings } = plugin;
    const pluginId = `WebConsolePlugin${id++}`;

    // this.on(pluginEvents.WEB_CONSOLE_READY, () => {
    //   this._isWebConsoleReady = true;
    // });

    const _plugin = {
      id: pluginId,
      name,
      settings,
      component: {
        ...component,
        name: component.name || pluginId,
        mixins: [...(component.mixins || []), this._mixins]
      }
    };
    this._plugins.push(_plugin);
  }

  getPlugins() {
    return this._plugins;
  }

  updateSettings(settings) {
    this._settings = settings;
  }

  getSettings() {
    return this._settings;
  }

  toString() {
    return JSON.stringify(this._plugins, null, 4);
  }
}

export default new PluginManager();
