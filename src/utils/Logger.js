import { isDev, isString } from "./base";

/* 原始的 console 方法  */
const _error = window.console.error;
const _log = window.console.log;

/**
 * 日志类
 * 调用原始的 console 方法打印日志
 */
export default class Logger {
  constructor(prefix) {
    this._prefix = prefix ? prefix + " " : "";
  }
  error(...args) {
    if (!isDev) return;

    if (isString(args[0])) {
      args[0] = this._prefix + args[0];
    } else {
      args.unshift(this._prefix);
    }
    _error.apply(this, args);
  }
  log(...args) {
    if (!isDev) return;

    if (isString(args[0])) {
      args[0] = this._prefix + args[0];
    } else {
      args.unshift(this._prefix);
    }
    _log.apply(this, args);
  }
}
