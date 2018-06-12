# web-console

<https://whinc.github.io/web-console/>

# depoly

构建单个 js 包
```bash
npm run build:lib
```

部署在线demo
```bash
npm run depoly:web
```

发布到 npm
```bash
npm run build:lib
npm login
npm version <new_version>
npm publish --access=public
```