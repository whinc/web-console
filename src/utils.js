
export {default as cloneDeep} from 'lodash.clonedeep'
export const isNull = v => v === null
export const isUndefined = v => v === undefined
export const isString = v => typeof v === 'string'
export const isFunction = v => typeof v === 'function'
export const isNumber = v => typeof v === 'number'
export const isSymbol = v => typeof v === 'symbol'
export const isBoolean = v => typeof v === 'boolean'
export const isObject = v => typeof v === 'object' && v