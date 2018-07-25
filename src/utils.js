
export {default as cloneDeep} from 'lodash.clonedeep'
export const isNull = v => v === null
export const isUndefined = v => v === undefined
export const isString = v => typeof v === 'string'
export const isFunction = v => typeof v === 'function'
export const isArray = v => Array.isArray(v)
export const isNumber = v => typeof v === 'number'
export const isSymbol = v => typeof v === 'symbol'
export const isBoolean = v => typeof v === 'boolean'
export const isObject = v => typeof v === 'object' && v

export const noop = function () {}

/**
 * generate an uuid
 * @returns string
 */
export const uuid = () => {
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : ((r & 0x3) | 0x8)
    return v.toString(16)
  })
  return id
}

export const flatMap = (arr, callback) => {
  let r = []
  arr.forEach((v, i) => {
    const r2 = callback(v, i)
    r2.forEach(v2 => r.push(v2))
  })
  return r
}

/* 原始的 console 方法  */
export const _console = {
  error: window.console.error,
  log: window.console.log
}
