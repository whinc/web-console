import Vue from "vue";
import Logger from "./Logger";

const logger = new Logger("[EventBus]");
class EventBus {
  constructor(events = {}) {
    this._vue = new Vue();

    Object.assign(this, events);
    // this._eventNameList = Object.keys(events).map(name => events[name]);
  }
  emit(eventName, ...args) {
    // if (!this._eventNameList.some(v => v === eventName)) {
    //   logger.warn("unregistered event name:", eventName);
    //   return;
    // }

    logger.log('emit: "%s"', eventName, ...args);
    // freeze 一下避免 Vue 添加一些额外字段，同时也确保事件数据传递时不被修改
    this._vue.$emit(eventName, ...args.map(v => Object.freeze(v)));
  }
  on(eventName, callback) {
    // if (!this._eventNameList.some(v => v === eventName)) {
    //   logger.warn("unregistered event name:", eventName);
    //   return;
    // }

    logger.log('on: "%s"', eventName);
    this._vue.$on(eventName, callback);
  }
}

export { EventBus };

/*
 * 预定义事件类型
 * 目标触发了事件：<target>:<event_name>
 * 请求目标触发事件：<request>:<target>:<event_name>
 */
export default new EventBus({
  POPUP_VISIBILITY_CHANGE: "popup_visibility_change",
  SETTINGS_CHANGE: "settings_change",
  SETTINGS_LOADED: "settings_loaded",
  WEB_CONSOLE_SHOW: "web-console:show",
  WEB_CONSOLE_HIDE: "web-console:hide",
  REQUEST_WEB_CONSOLE_HIDE: "request:web-console:hide"
});
