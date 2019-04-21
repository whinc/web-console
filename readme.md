# web-console

![Github release](https://img.shields.io/npm/v/@whinc/web-console.svg)
![总下载量](https://img.shields.io/npm/dt/@whinc/web-console.svg)
![月下载量](https://img.shields.io/npm/dm/@whinc/web-console.svg)
![周下载量](https://img.shields.io/npm/dw/@whinc/web-console.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@whinc/web-console.svg)
![LINCENSE](https://img.shields.io/github/license/mashape/apistatus.svg)

web-console 是一款基于 H5 开发的移动端 Web 调试工具。其高度还原了 Chrome DevTools 的功能和交互，支持 webpack 打包和`<script>`方式引入。

在线演示：<https://whinc.github.io/web-console/>

CDN 地址：<https://unpkg.com/@whinc/web-console>

![snapshot](./docs/snapshot.png)

[更多运行截图点击这里](https://github.com/whinc/web-console/blob/master/docs/snapshot.md)

## 功能特性

web-console 特性列表完成情况（可能会变动）：

- Element 面板
  - 支持 DOM 树展示
  - 支持查看 DOM 节点的继承样式
  - 支持查看 DOM 节点的计算样式
  - 支持查看 DOM 节点的盒模型
- Console 面板
  - 支持 console 对象的 log/warn/info/error/debug 方法
  - 支持 log 等日志方法的多参数输出
  - 支持 log 等日志方法的参数格式化输出，如`%s, %i, %d, %f, %d, %o, %O, %c`
  - 支持日志过滤
- Network 面板
  - 支持`XMLHttpRequest`请求和响应的展示
  - 支持`fetch`请求和响应的展示
  - 支持响应数据的预览
- Application 面板
  - 支持 cookie、localStorage 和 sessionStorage 的增删改查
  - 支持 cookie、localStorage 和 sessionStorage 按关键字过滤
- Settings 面板
  - 设置各面板默认行为
  - 关于信息
- 插件
  - 支持自定义插件
  - 支持插件生命周期
  - 支持插件偏好设置
  - 支持使用内置组件

## 如何使用?

### 模块化方式导入

安装 npm 包

```
npm install @whinc/web-console
```

导入 web-console 并初始化

```js
import WebConsole from "@whinc/web-console";
new WebConsole();
```

或者，仅在开发模式下导入

```js
if (process.env.NODE_ENV === "development") {
  import("@whinc/web-console").then(WebConsole => {
    new WebConsole(config);
  });
}
```

### `<script>`标签导入

在 html 文件中引入 web-console（依赖 Vue 2.x）

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/@whinc/web-console"></script>
```

通过下面代码初始化

```js
new WebConsole(config);
```

## API

TODO

## 插件开发

web-console 提供一些开箱即用的功能，如果这些无法满足你的需求，你还可以通过 web-console 提供的插件机制，添加第三方编写的插件来扩展功能，具体可以参考[插件开发](./docs/plugin.md)。

## 更新日志

[CHANGELOG](CHANGELOG.md)

## License

MIT
