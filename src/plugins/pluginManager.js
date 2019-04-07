import { eventBus, EventBus, isFunction } from "@/utils";
import { VFootBar } from "@/components";
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

    const pluginMgr = this;
    this._injectedLifeCycleMethods = {
      components: {
        VFootBar
      },
      // created 周期函数触发时，Vue 已完成事件部署
      created() {
        const vm = this;
        // 注册插件生命周期方法
        Object.keys(pluginEvents)
          .map(key => pluginEvents[key])
          .forEach(event => {
            pluginMgr.on(event, (...args) => {
              const fn = this[event];
              if (isFunction(fn)) {
                fn.call(vm, hostProxy, ...args);
              }
            });
          });
      } // created
    };
  }

  /**
   * 注册插件
   * @param {Object} plugin
   * @param {Object} plugin.component 插件内容，是一个 Vue 组件
   */
  addPlugin(plugin) {
    const { name, component, settings } = plugin;
    const pluginId = `WebConsolePlugin${id++}`;

    this.on(pluginEvents.WEB_CONSOLE_READY, () => {
      this._isWebConsoleReady = true;
    });

    const _plugin = {
      id: pluginId,
      name,
      settings,
      component: {
        ...component,
        name: component.name || pluginId,
        mixins: [...(component.mixins || []), this._injectedLifeCycleMethods]
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
