/**
 * 插件事件
 *
 * 约定：事件名称与插件的生命周期方法同名
 */
export default Object.freeze({
  // 插件 DOM 已渲染
  WEB_CONSOLE_READY: "onWebConsoleReady",
  WEB_CONSOLE_SHOW: "onWebConsoleShow",
  WEB_CONSOLE_HIDE: "onWebConsoleHide",
  WEB_CONSOLE_TAB_CHANGED: "onWebConsoleTabChanged",
  WEB_CONSOLE_SETTINGS_LOADED: "onWebConsoleSettingsLoaded",
  WEB_CONSOLE_SETTINGS_CHANGED: "onWebConsoleSettingsChanged"
});
