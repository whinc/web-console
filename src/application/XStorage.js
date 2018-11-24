import { Logger, cloneDeep } from "@/utils";
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
 *
 * ------------------
 * | localStorage   |
 * | sessionStorage | <-->  Data Srouce  <--> Filtered Data Srouce  <--> XStorage
 * | cookie         |
 * ------------------
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
    // filter keyword
    this._filter = "";
    // 下次加载的开始位置
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
    return cloneDeep(this._fds.slice(startIndex, startIndex + pageSize));
  }

  // 从上一次加载结束位置开始，加载一页数据
  loadMoreItems() {
    logger.log("loadMoreItems");
    const items = this.loadItems(this._cursor);
    this._cursor += items.length;
    return items;
  }

  hasMore() {
    return this._cursor < this._fds.length;
  }

  get length() {
    return this._fds.length;
  }

  getItem(key) {
    return this._storage.getItem(key);
  }

  setItem(key, value) {
    this._storage.setItem(key, value);
    /**
     * 更新存在两种情况:
     * 1) 更新已存在项，这种情况不需要刷新数据源，只要更新数据源中指定项即可
     * 2) 新增项，这种情况必须刷新数据源，保证读出的数据源列表保持自然顺序
     *
     * 针对第 2 中情况进行示例说明，假设分页大小为 2 并且 localStorage 是倒序读取（storage 读取顺序是浏览器决定的，这里假设这种读取方式）
     * data source      UI data     action
     * [A, B, C, D]     [D, C]      修改 D -> E
     * {E, A, B, C}     [E, C]      加载下一页
     * {E, A, B, C}     [E, C, A, E]
     * 由于修改后导致读取顺序变化，分页加载的数据不再准确
     */
    const item = this._ds.find(item => item.key === key);
    if (item) {
      // 更新已存在项
      item.value = value;
      const item2 = this._fds.find(item => item.key === key);
      if (item2) {
        item2.value = value;
      }
    } else {
      // 新增项
      this._refreshDataSource();
    }
  }

  removeItem(key) {
    this._storage.removeItem(key);

    /**
     * 为了提高性能并保留已读取出来的数据，不直接刷新数据源，而是从数据源中删除指定项
     * 删除不会影响已读取数据源中数据的排列顺序
     */
    const foundIndex = this._ds.findIndex(item => item.key === key);
    if (foundIndex !== -1) {
      this._ds.splice(foundIndex, 1);
      const foundIndex2 = this._fds.findIndex(item => item.key === key);
      if (foundIndex2 !== -1) {
        this._fds.splice(foundIndex2, 1);
      }
      // 当前游标前移 1 格
      this._cursor -= 1;
    }
    // logger.log('removeItem', this)
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
