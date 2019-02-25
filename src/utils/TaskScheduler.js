import { isFunction } from "./miscs";
import Logger from "./Logger";

const logger = new Logger("[TaskScheduler]");
/**
 * 任务调度器
 * 用途：按任意速率添加任务，之后这些任务按指定速率按序执行，避免阻塞交互
 *
 * 第一版实现方式：新增任务放入队列，调度器间隔一定时间执行 1 个任务，这种方式问题在于每次执行的任务数量
 * 只有一个，导致任务执行的总时间变长，总时间 = 任务数量 * 间隔时间
 *
 * T T T T T T T  <-- push task
 * T -> wait -> T -> wait -> T
 *
 * 第二版实现方式：新增任务放入队列，调度器间隔一定时间执行 N 个任务，总时间 = 任务数量 / N * 间隔时间，
 * 大大缩短了任务执行的总时间
 *
 * T T T T T T T  <-- push task
 * T...T -> wait -> T...T -> wait -> T...T
 *
 * 示例：
 * const scheduler = new TaskScheduler(interval)
 * scheduler.addAndStart(task1)
 * scheduler.addAndStart(task2)
 */
export default class TaskScheduler {
  constructor({ interval = 200, taskBundleSize = 100 } = {}) {
    this._interval = interval;
    this._isRunning = false;
    this._tasks = [];
    this._timerId = null;
    this._taskBundleSize = taskBundleSize;
  }

  get length() {
    return this._tasks.length;
  }

  add(task) {
    if (!isFunction(task)) return;

    this._tasks.push(task);
  }

  addAndStart(task) {
    this.add(task);
    if (this.length > 0) {
      this.start({ immediate: true });
    }
  }

  /**
   * 启动调度
   * @param {Object} params
   * @param {Boolean} params.immediate 是否立即执行队列任务
   */
  start({ immediate = true } = {}) {
    this._runTask(immediate);
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

  _shiftTaskBunlde() {
    const count = Math.min(this._tasks.length, this._taskBundleSize);
    const taskBundle = this._tasks.slice(0, count);
    this._tasks = this._tasks.slice(count);

    // logger.log("_shiftTaskBunlde remove:", count, "rest:", this.length);
    return taskBundle;
  }

  _runTask(immediate = false) {
    if (this.length <= 0 || this._isRunning) return;

    this._isRunning = true;

    if (immediate) {
      const task = this._tasks.shift();
      task.call(null);
      // logger.log("_runTask immediate size:", 1);
    }
    this._timerId = setTimeout(() => {
      const tasks = this._shiftTaskBunlde();
      tasks.forEach(task => task.call(null));

      this._isRunning = false;
      this._runTask();
    }, this._interval);
  }
}
