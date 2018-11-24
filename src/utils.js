import Vue from "vue";

export const isNull = v => v === null;
export const isUndefined = v => v === undefined;
export const isString = v => typeof v === "string";
export const isFunction = v => typeof v === "function";
export const isArray = v => Array.isArray(v);
export const isNumber = v => typeof v === "number";
export const isSymbol = v => typeof v === "symbol";
export const isBoolean = v => typeof v === "boolean";
export const isObject = v => typeof v === "object" && v !== null;

export const isDev = process.env.NODE_ENV !== "production";

export const noop = function() {};
export const cloneDeep = v => JSON.parse(JSON.stringify(v));

export const nextTick = cb => {
  if (typeof window.Promise === "function") {
    Promise.resolve().then(cb);
  } else {
    setTimeout(cb, 0);
  }
};

/**
 * 任务调度器
 * 用途：按任意速率添加任务，之后这些任务按指定速率按序执行，避免阻塞交互
 * 示例：
 * const scheduler = new TaskScheduler(interval)
 * scheduler.add(task1)
 * scheduler.add(task2)
 */
export class TaskScheduler {
  // 默认的任务处理器
  static get default() {
    return new TaskScheduler();
  }

  constructor(interval = 20) {
    this._interval = interval;
    this._isRunning = false;
    this._tasks = [];
    this._timerId = null;
  }

  add(task) {
    if (!isFunction(task)) return;

    this._tasks.push(task);
  }

  addAndStart(task) {
    this.add(task);
    this.start({ immediate: false });
  }

  /**
   * 启动调度
   * @param {Object} params
   * @param {Boolean} params.immediate 是否立即执行队列任务
   */
  start({ immediate = true } = {}) {
    if (this._isRunning) return;

    if (immediate && this._tasks.length > 0) {
      const task = this._tasks.shift();
      task.call(null);
    }

    this._runTask();
  }

  // 停止调度，并清空任务队列
  stop() {
    if (this._timerId !== null) {
      clearTimeout(this._timerId);
      this._timerId = null;
    }
    this._tasks = [];
    this._isRunning = false;
  }

  _runTask() {
    if (this._tasks.length > 0 && !this._isRunning) {
      this._isRunning = true;
      const task = this._tasks.shift();
      this._timerId = setTimeout(() => {
        task.call(null);
        this._isRunning = false;
        this._runTask();
      }, this._interval);
    }
  }
}

/**
 * generate an uuid
 * @returns string
 */
export const uuid = () => {
  let id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0;
    let v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return id;
};

export const flatMap = (arr, callback) => {
  let r = [];
  arr.forEach((v, i) => {
    const r2 = callback(v, i);
    r2.forEach(v2 => r.push(v2));
  });
  return r;
};

/**
 * 在目标对象上创建一个 stack 属性表示调用堆栈
 * @param {*} targetObject
 * @param {*} constructorOpt 该函数（含自身）以上的堆栈都会被忽略
 */
export const createStack = (targetObject, constructorOpt) => {
  // Chrome 提供 captureStackTrace 方法记录堆栈信息到目标对象的 stack 属性，参考<https://github.com/dwqs/blog/issues/49>
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(targetObject, constructorOpt);
  }
  // safari 创建的 Error 对象包含 stack 属性记录堆栈信息
  if (typeof targetObject.stack === "string") {
    targetObject.stack = targetObject.stack.replace(/https?:\/\/.*\/(.*)/g, "$1");
  }
};

/* 原始的 console 方法  */
const error = window.console.error;
const log = window.console.log;
export class Logger {
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
    error.apply(this, args);
  }
  log(...args) {
    if (!isDev) return;

    if (isString(args[0])) {
      args[0] = this._prefix + args[0];
    } else {
      args.unshift(this._prefix);
    }
    log.apply(this, args);
  }
}

export const _console = new Logger();

class EventBus {
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
export const eventBus = new EventBus();
