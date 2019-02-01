const path = require("path");

/** 以 VUE_APP_* 开头的环境变量会替换代码中相应的变量 */
const npmPkg = require("./package.json");
process.env.VUE_APP_NAME = npmPkg.name;
process.env.VUE_APP_VERSION = npmPkg.version;
process.env.VUE_APP_DATE = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString();

module.exports = {
  css: {
    extract: false
  },
  // 部署和测试时用，打包成 lib 时不需要
  baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
  configureWebpack: {
    // 将入口的导出作为默认导出
    output: {
      libraryExport: "default"
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    }
  }
};
