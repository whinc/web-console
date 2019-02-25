export { default as cloneDeep } from "lodash.clonedeep";

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

export const nextTick = cb => {
  if (typeof window.Promise === "function") {
    Promise.resolve().then(cb);
  } else {
    setTimeout(cb, 0);
  }
};

// 将 HTTP content-type 类型转换成 highlight.js 所支持的语法高亮类型
export const mimeType2Language = mimeType => {
  switch (true) {
    case /javascript/.test(mimeType):
      return "javascript";
    case /json/.test(mimeType):
      return "json";
    case /html/.test(mimeType):
      return "html";
    case /css/.test(mimeType):
      return "css";
    default:
      return "";
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

export const formatFileName = (s = "") => s.replace(/https?:\/\/.*\/(.*)/g, "$1");

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
    targetObject.stack = formatFileName(targetObject.stack);
  }
};

// 获取 URL 中的文件名(含扩展名)
export const getURLFileName = url => {
  if (typeof url !== "string") return "";

  const index = url.lastIndexOf("/");
  return url.slice(index + 1);
};
