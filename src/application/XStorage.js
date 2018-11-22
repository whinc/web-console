import { Logger } from "@/utils";
import { cookie } from "cookie_js";

const logger = new Logger("XStorage");

class CookieStorage {
  constructor() {
    this._keys = [];
    this._cookies = {};
    this.refresh();
  }

  refresh() {
    const cookies = cookie.all();
    this._keys = Object.keys(cookies);
    // this._cookies = cookies
  }

  get length() {
    return this._keys.length;
  }

  key(n) {
    return this._keys[n];
  }

  getItem(key) {
    return cookie.get(key);
  }

  setItem(key, value) {
    cookie.set(key, value);
    this.refresh();
  }

  removeItem(key) {
    cookie.remove(key);
    this.refresh();
  }

  clear() {
    cookie.empty();
    this.refresh();
  }
}

/**
 * 统一 localStorage/sessionStorage/cookie 三种存储器接口
 */
class XStorage {
  // 分页大小
  static get PAGE_SIZE() {
    return 20;
  }

  constructor(type) {
    if (type === "localStorage" || type === "sessionStorage") {
      this._storage = window[type];
    } else if (type === "cookieStorage") {
      this._storage = new CookieStorage();
    } else {
      logger.error("unsupport storage type:", type);
    }

    // data source
    this._ds = [];
    // filterd data source
    this._fds = [];
    this._filter = "";
    // 当前分页加载的索引
    this._cursor = 0;

    this.refresh();
  }

  setFilter(filter) {
    const isChange = filter !== this._filter;

    if (typeof filter === "string" && filter) {
      this._filter = filter;
    } else {
      this._filter = "";
    }

    if (isChange) {
      this._refreshFilteredDataSource();
    }
  }

  refresh() {
    this._cursor = 0;
    this._refreshDataSource();
  }

  // 从指定位置开始，加载一页数据
  loadItems(startIndex, pageSize = XStorage.PAGE_SIZE) {
    return this._fds.slice(startIndex, startIndex + pageSize);
  }

  // 从上一次加载结束位置开始，加载一页数据
  loadMoreItems() {
    logger.log("loadMoreItems");
    const items = this.loadItems(this._cursor);
    this._cursor += items.length;
    return items;
  }

  hasMore() {
    return this._cursor < this._fds.length - 1;
  }

  get length() {
    return this._storage.length;
  }

  getItem(key) {
    return this._storage.getItem(key);
  }

  setItem(key, value) {
    this._storage.setItem(key, value);
    this._refreshDataSource();
  }

  removeItem(key) {
    this._storage.removeItem(key);
    this._refreshDataSource();
  }

  clear() {
    this._storage.clear();
    this._ds = [];
    this._fds = [];
    this._cursor = 0;
  }

  // 更新数据源
  _refreshDataSource() {
    logger.log("_refreshDataSource", this);
    let key, value;
    const storage = this._storage;
    const length = this._storage.length;
    this._ds = [];
    for (let j = 0; j < length; ++j) {
      key = storage.key(j);
      value = storage.getItem(key);
      this._ds.push({ key, value });
    }
    this._refreshFilteredDataSource();
  }

  // 更新过滤数据源
  _refreshFilteredDataSource() {
    logger.log("_refreshFilteredDataSource", this);
    const filter = this._filter;
    const ds = this._ds;
    this._fds = [];
    if (filter) {
      // 过滤出 key 或 value 中包含关键字的项
      this._fds = ds.filter(({ key, value }) => key.indexOf(filter) >= 0 || value.indexOf(filter) >= 0);
    } else {
      this._fds = ds;
    }
  }
}

window.CookieStorage = CookieStorage;
window.XStorage = XStorage;
export default XStorage;
