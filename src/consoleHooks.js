import { uuid } from "@/utils";

// hook console
// install 前的 console 接口
const originConsole = {};
// install 后的 console 接口（之后第三方可能会再次重写改接口)
const currentConsole = {};
const names = ["log", "info", "error", "warn", "debug"];
const msgList = [];
let active = false;

const install = () => {
  active = true;
  names.forEach(name => {
    originConsole[name] = window.console[name];

    currentConsole[name] = function(...args) {
      if (active) {
        const msg = {
          id: uuid(),
          type: name,
          logArgs: args
        };
        // 冻结计算结果，避免 Vue 添加额外属性
        msgList.push(Object.freeze(msg));
      }
      originConsole[name].apply(this, args);
    };

    window.console[name] = currentConsole[name];
  });
};

// 卸载
const uninstall = () => {
  active = false;
  // 如果第三方没有重写 console 接口，则还原 console 接口为原生的 console 接口
  names.forEach(name => {
    if (currentConsole[name] === window.console[name]) {
      window.console[name] = originConsole[name];
    }
  });
};

const getMsgList = () => msgList;

export default { install, uninstall, getMsgList };
