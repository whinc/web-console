# web-console

mobile version of Chrome DevTools.

在线演示：<https://whinc.github.io/web-console/>

CDN 地址：<https://unpkg.com/@whinc/web-console>

## 开始使用

### 在 Web 页中使用

引入下面 vue 和 web-console 的 js 文件

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/@whinc/web-console"></script>
```

通过下面代码初始化

```js
window["web-console"].init();
```

### 在模块中使用

安装 web-console 包

```
npm install @whinc/web-console
```

在代码中导入

```js
import WebConsole from "@whinc/web-console";

WebConsole.init();
```

## 更新日志

[CHANGELOG](CHANGELOG.md)

## 部署

更新 github.io 在线示例：

```
npm run depoly
```

发布到 npm 仓库：

```bash
npm version <new_version>
```
