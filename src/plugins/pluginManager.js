/**
 * 插件管理
 */
import { eventBus, EventBus } from "@/utils";
import Plugin from "./Plugin";

class PluginManager extends EventBus {
  constructor(...args) {
    super(...args);
    /**
     * 插件集合
     * @type {Array<Plugin>}
     */
    this._plugins = [];
    // 当前最新的设置
    this._settings = {};
    // 宿主代理
    this._hostProxy = null;
  }

  // 宿主代理，提供一些操作 web-console 的方法
  get hostProxy() {
    if (!this._hostProxy) {
      this._hostProxy = {
        hidePanel: () => eventBus.emit(eventBus.REQUEST_WEB_CONSOLE_HIDE),
        getSettings: () => this._settings
      };
    }
    return this._hostProxy;
  }

  /**
   * 注册插件
   * @param {Plugin} plugin
   */
  addPlugin(plugin) {
    if (!(plugin instanceof Plugin)) {
      console.warn("Invalid plugin: plugin should inherit WebConsole.Plugin");
      return;
    }

    if (!plugin.id) {
      console.warn(`Empty plugin id: plugin id must not be empty and must be unique among all plugins`);
      return;
    }

    if (this._plugins.find(v => v.id === plugin.id)) {
      console.warn(`Plugin conflict: plugin id "${plugin.id}" has existed`);
      return;
    }

    plugin.__init__(this);
    this._plugins.push(plugin);
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

  hasPlugin(pluginId) {
    return this._plugins.findIndex(plugin => plugin.id === pluginId) !== -1;
  }

  toString() {
    return JSON.stringify(this._plugins, null, 4);
  }
}

export default new PluginManager();
