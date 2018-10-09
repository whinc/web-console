# web-console

在线演示：<https://whinc.github.io/web-console/>

CDN 地址：<https://unpkg.com/@whinc/web-console>

# 引入

方式一：通过引入链接使用

引入下面 vue 和 web-console 的 js 文件

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/@whinc/web-console"></script>
```

通过下面代码初始化

```js
window["web-console"].init();
```

方式二：导入 npm 模块使用

安装 web-console 包

```
npm install @whinc/web-console
```

在代码中导入

```js
import WebConsole from "@whinc/web-console";

WebConsole.init();
```

# 部署 & 发布

更新 github.io 在线示例：

```
npm run depoly
```

发布到 npm 仓库：

```bash
npm version <new_version>
```
