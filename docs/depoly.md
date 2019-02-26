## 部署

发布到 npm 仓库：

```bash
# 发次版本
npm run publish:minor
# 发补丁版本
npm run publish:patch
# 预发布版
npm run publish:prerelease
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
