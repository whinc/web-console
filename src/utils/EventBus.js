import Vue from "vue";
import Logger from "./Logger";

export default class EventBus {
  constructor() {
    this._vue = new Vue();
    this._logger = new Logger("[EventBus]");

    this.POPUP_VISIBILITY_CHANGE = "popup_visibility_change";
    this.POPUP_HIDE = "popup_hide";
    this.SETTINGS_CHANGE = "settings_change";
  }
  emit(event, ...args) {
    this._logger.log('emit: "%s"', event, ...args);
    // freeze 一下避免 Vue 添加一些额外字段，同时也确保事件数据传递时不被修改
    this._vue.$emit(event, ...args.map(v => Object.freeze(v)));
  }
  on(event, callback) {
    this._logger.log('on: "%s"', event);
    this._vue.$on(event, callback);
  }
}
