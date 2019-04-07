/**
 * 插件事件
 * 约定：事件的 value 值对应插件被调用的生命周期方法名称
 */
export default Object.freeze({
  // 插件 DOM 已渲染
  WEB_CONSOLE_READY: "onWebConsoleReady",
  WEB_CONSOLE_SHOW: "onWebConsoleShow",
  WEB_CONSOLE_HIDE: "onWebConsoleHide",
  WEB_CONSOLE_TAB_CHANGED: "onWebConsoleTabChanged",
  WEB_CONSOLE_SETTINGS_CHANGED: "onWebConsoleSettingsChanged"
});
