import { isFunction } from "./base";

/**
 * 任务调度器
 * 用途：按任意速率添加任务，之后这些任务按指定速率按序执行，避免阻塞交互
 * 示例：
 * const scheduler = new TaskScheduler(interval)
 * scheduler.add(task1)
 * scheduler.add(task2)
 */
export default class TaskScheduler {
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
