<a name="0.2.0-rc.9"></a>

# [0.2.0-rc.9](https://github.com/whinc/web-console/compare/v0.2.0-rc.7...v0.2.0-rc.9) (2018-10-26)

### Performance Improvements

- **console:** 提升面板切换性能 ([a068d6c](https://github.com/whinc/web-console/commit/a068d6c))

<a name="0.2.0-rc.7"></a>

# [0.2.0-rc.7](https://github.com/whinc/web-console/compare/v0.2.0-rc.6...v0.2.0-rc.7) (2018-10-09)

<a name="0.2.0-rc.6"></a>

# [0.2.0-rc.6](https://github.com/whinc/web-console/compare/v0.2.0-rc.5...v0.2.0-rc.6) (2018-10-09)

### Features

- **network:** 响应数据增加语法高亮 ([dcc3df7](https://github.com/whinc/web-console/commit/dcc3df7))
- **network:** 增加 JSON 数据预览 ([a099205](https://github.com/whinc/web-console/commit/a099205))
- **network:** 增加响应数据预览 ([0bb4e95](https://github.com/whinc/web-console/commit/0bb4e95))
- **network:** 支持预览 gif/jpg/svg/txt ([72fcd52](https://github.com/whinc/web-console/commit/72fcd52))

<a name="0.2.0-rc.5"></a>

# [0.2.0-rc.5](https://github.com/whinc/web-console/compare/v0.2.0-rc.4...v0.2.0-rc.5) (2018-09-14)

### Bug Fixes

- 修复触摸滚动穿透问题 ([f017338](https://github.com/whinc/web-console/commit/f017338))

<a name="0.2.0-rc.4"></a>

# [0.2.0-rc.4](https://github.com/whinc/web-console/compare/v0.2.0-rc.3...v0.2.0-rc.4) (2018-09-11)

### Bug Fixes

- **network:** response 数据超出边界时无法滚动查看 ([4111487](https://github.com/whinc/web-console/commit/4111487))

<a name="0.2.0-rc.3"></a>

# [0.2.0-rc.3](https://github.com/whinc/web-console/compare/v0.2.0-rc.2...v0.2.0-rc.3) (2018-09-10)

### Bug Fixes

- **console:** 未正确识别占位符 %c 导致的显示问题 ([c740d16](https://github.com/whinc/web-console/commit/c740d16))
- 面板可见时悬浮按钮未隐藏 ([41f8af5](https://github.com/whinc/web-console/commit/41f8af5))

<a name="0.2.0-rc.2"></a>

# [0.2.0-rc.2](https://github.com/whinc/web-console/compare/v0.2.0-rc.1...v0.2.0-rc.2) (2018-09-08)

<a name="0.2.0-rc.1"></a>

# [0.2.0-rc.1](https://github.com/whinc/web-console/compare/v0.1.2...v0.2.0-rc.1) (2018-09-08)

### Bug Fixes

- 对象展示问题 ([0eb0a14](https://github.com/whinc/web-console/commit/0eb0a14))
- 测试用例报错 ([f2ad431](https://github.com/whinc/web-console/commit/f2ad431))
- **console:** 修复字符串显式时没有引号包裹；修复字符串很长时没有自动换行的问题 ([42b27c2](https://github.com/whinc/web-console/commit/42b27c2))
- 移除同名文件 ([3c86612](https://github.com/whinc/web-console/commit/3c86612))
- **console:** get 访问器的计算结果没有展开 ([64fc61e](https://github.com/whinc/web-console/commit/64fc61e))
- **console:** vue 向原始日志数据中添加额外属性的问题 ([ef0424b](https://github.com/whinc/web-console/commit/ef0424b))
- **console:** 使日志每行内容垂直居中 ([5d95035](https://github.com/whinc/web-console/commit/5d95035))
- **console:** 多参数打印空格问题 ([9b90a00](https://github.com/whinc/web-console/commit/9b90a00))
- **console:** 对象的折叠展开态 ([0c59572](https://github.com/whinc/web-console/commit/0c59572))
- **console:** 属性名和值过长时导致属性名未对齐;Symb 和转符串拼接时报错 ([0e6c192](https://github.com/whinc/web-console/commit/0e6c192))
- **console:** 打印对象时丢失不可枚举和 symbol 属性 ([f3901ef](https://github.com/whinc/web-console/commit/f3901ef))
- **console:** 打印的对象属性键换行导致不易阅读的问题 ([53f018a](https://github.com/whinc/web-console/commit/53f018a))
- **console:** 样式错误显式为斜体 ([83f24ca](https://github.com/whinc/web-console/commit/83f24ca))
- **console:** 计算属性结果没有高亮 ([a769a41](https://github.com/whinc/web-console/commit/a769a41))
- **network:** 状态码 ([d39e2c2](https://github.com/whinc/web-console/commit/d39e2c2))

### Features

- **cosole:** 增加多参数高亮展示；增加 console 面板内部错误处理； ([0b13707](https://github.com/whinc/web-console/commit/0b13707))
- **network:** 优化网络请求 Headers 的展示 ([fe26231](https://github.com/whinc/web-console/commit/fe26231))
- **network:** 增加对 POST 中 JSON 数据格式的展示 ([2b25641](https://github.com/whinc/web-console/commit/2b25641))
- **network:** 增加接口测试代码；解决 onreadystatechange 事件注册时机问题 ([2822d35](https://github.com/whinc/web-console/commit/2822d35))
- **network:** 增加清除；优化行高；补充测试用例 ([ceff5e7](https://github.com/whinc/web-console/commit/ceff5e7))
- **network:** 增加请求头、查询参数和 POST 数据展示 ([4075a9f](https://github.com/whinc/web-console/commit/4075a9f))
- **network:** 请求头信息分类展示 ([6fdb205](https://github.com/whinc/web-console/commit/6fdb205))
- **network:** 错误状态码高亮展示 ([78e78ac](https://github.com/whinc/web-console/commit/78e78ac))
- 入口浮标支持滑动、图标样式 ([01bee17](https://github.com/whinc/web-console/commit/01bee17))

<a name="0.1.2"></a>

## [0.1.2](https://github.com/whinc/web-console/compare/v0.1.1...v0.1.2) (2018-06-12)

<a name="0.1.1"></a>

## [0.1.1](https://github.com/whinc/web-console/compare/1dfc2f0...v0.1.1) (2018-06-12)

### Bug Fixes

- **build:** 修复 npm run serve 问题 ([93162f9](https://github.com/whinc/web-console/commit/93162f9))
- **build:** 修复构建问题 ([a3eb6a2](https://github.com/whinc/web-console/commit/a3eb6a2))
- **demo:** 修正日志打印接口调用 ([83882a9](https://github.com/whinc/web-console/commit/83882a9))
- **network:** 修复手机上无法滚动 ([919c618](https://github.com/whinc/web-console/commit/919c618))

### Features

- **console:** 增加 clear 和 hide 两个操作 ([f0238a4](https://github.com/whinc/web-console/commit/f0238a4))
- **console:** 增加日志消息分类展示 ([f17a653](https://github.com/whinc/web-console/commit/f17a653))
- **ConsolePanel:** 美化日志输出样式 ([1dfc2f0](https://github.com/whinc/web-console/commit/1dfc2f0))
- **network:** 内容超出时变为 scroll ([d4efd7f](https://github.com/whinc/web-console/commit/d4efd7f))
- **network:** 初步实现对 XMLHttpRequest 的请求的拦截显示 ([bfc8f72](https://github.com/whinc/web-console/commit/bfc8f72))
- WebConsole 支持初始化参数；增加测试用例 ([9974f00](https://github.com/whinc/web-console/commit/9974f00))
- **network:** 增加样式 ([dbf58f8](https://github.com/whinc/web-console/commit/dbf58f8))
- **network:** 展示请求响应头和数据 ([3469c9f](https://github.com/whinc/web-console/commit/3469c9f))
- **network:** 显示请求的 response 内容 ([d3c759e](https://github.com/whinc/web-console/commit/d3c759e))
- 导出全局的 WebConsole 变量 ([a0282a4](https://github.com/whinc/web-console/commit/a0282a4))
- 面板的 Tab 栏替换成自定义组件 ([37f6923](https://github.com/whinc/web-console/commit/37f6923))
