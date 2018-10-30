export const isNull = v => v === null;
export const isUndefined = v => v === undefined;
export const isString = v => typeof v === "string";
export const isFunction = v => typeof v === "function";
export const isArray = v => Array.isArray(v);
export const isNumber = v => typeof v === "number";
export const isSymbol = v => typeof v === "symbol";
export const isBoolean = v => typeof v === "boolean";
export const isObject = v => typeof v === "object" && v !== null;

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
  if (typeof Error.captureStackTrace === "function") {
    // 记录堆栈信息到目标对象的 stack 属性，参考<https://github.com/dwqs/blog/issues/49>
    Error.captureStackTrace(targetObject, constructorOpt);
    if (typeof targetObject.stack === "string") {
      targetObject.stack = targetObject.stack.replace(/https?:\/\/.*\/([^:]*:\d+):\d+/g, "$1");
    }
  }
};

/* 原始的 console 方法  */
export const _console = {
  error: window.console.error,
  log: window.console.log
};
