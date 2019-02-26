## 部署

发布到 npm 仓库：

```bash
# 发版：打版本标签 -> 构建发布包 -> 发布到 npm 仓库
npm version <new_version>
```

更新 github.io 在线示例：

```bash
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
