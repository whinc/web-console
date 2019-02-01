## 部署

发布到 npm 仓库：

```bash
npm version <new_version>
```

生成 CHANGELOG：

```bash
npm run changelog
```

更新 github.io 在线示例：

```
npm run depoly
```

本地调试

```js
const script = document.createElement("script");
script.src = "http://localhost:8081/app.js";
script.onload = function() {
  new window.WebConsole();
};
document.body.appendChild(script);
```
