const path = require("path");

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
