import { eventBus, isFunction } from "@/utils";

let id = 0;

class PluginManager {
  constructor() {
    this._plugins = [
      /**
       *  {
       *    name: string,
       *    component: VueComponent,
       *    settings: Object
       *  }
       */
    ];
  }

  toString() {
    return JSON.stringify(this._plugins, null, 4);
  }

  addPlugin(plugin) {
    const pluginId = `web-console-plugin-${id++}`;
    const _plugin = {
      id: pluginId,
      name: plugin.name,
      component: {
        ...plugin.component,
        mixins: [
          {
            mounted() {
              eventBus.on(
                eventBus.WEB_CONSOLE_SHOW,
                () => isFunction(this.onWebConsoleShow) && this.onWebConsoleShow()
              );
              eventBus.on(
                eventBus.WEB_CONSOLE_HIDE,
                () => isFunction(this.onWebConsoleHide) && this.onWebConsoleHide()
              );
            }
          }
        ],
        name: pluginId
      }
    };
    this._plugins.push(_plugin);
  }

  getPlugins() {
    return this._plugins;
  }
}

export default new PluginManager();
