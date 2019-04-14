/**
 * 插件基类
 */
import { isFunction } from "@/utils";
import { VFootBar } from "@/components";
import pluginEvents from "./pluginEvents";

let _id = 0;

export default class Plugin {
  constructor({ id, name, settings, component }) {
    this.id = id;
    this.name = name || this.id;
    this.settings = isFunction(settings) ? settings.call(this) : settings;
    this.component = isFunction(component) ? component.call(this) : component;
  }

  __init__(pluginMgr) {
    // const plugin = this;
    const component = this.component;
    const pluginId = this.pluginId;

    this.component = {
      ...component,
      name: component.name || pluginId,
      mixins: [
        ...(component.mixins || []),
        {
          components: {
            VFootBar
          },
          created() {
            // created 周期函数触发时，Vue 已完成事件部署
            const vm = this;
            // 注册插件生命周期方法
            // 当接收到特定事件时，自动触发相应的插件生命周期方法
            Object.keys(pluginEvents)
              .map(key => pluginEvents[key])
              .forEach(event => {
                pluginMgr.on(event, (...args) => {
                  if (isFunction(vm[event])) {
                    vm[event].call(vm, pluginMgr.hostProxy, ...args);
                  }
                });
              });
          } // created
        }
      ] // mixins
    };

    // 暂不支持
    // Object.keys(pluginEvents)
    //   .map(key => pluginEvents[key])
    //   .forEach(event => {
    //     pluginMgr.on(event, (...args) => {
    //       if (isFunction(plugin[event])) {
    //         plugin[event].call(plugin, pluginMgr.hostProxy, ...args);
    //       }
    //     });
    //   });
  }

  [pluginEvents.WEB_CONSOLE_READY]() {}
  [pluginEvents.WEB_CONSOLE_SHOW]() {}
  [pluginEvents.WEB_CONSOLE_HIDE]() {}
  [pluginEvents.WEB_CONSOLE_TAB_CHANGED]() {}
  [pluginEvents.WEB_CONSOLE_SETTINGS_LOADED]() {}
  [pluginEvents.WEB_CONSOLE_SETTINGS_CHANGED]() {}

  toString() {
    return this.id + "(" + this.name + ")";
  }
}
