## [0.7.2](https://github.com/whinc/web-console/compare/v0.7.1...v0.7.2) (2019-04-23)

### Bug Fixes

- **console:** 修复打印多个参数时,它们之间没有空白符分割的问题 ([2292733](https://github.com/whinc/web-console/commit/2292733))

## [0.7.1](https://github.com/whinc/web-console/compare/v0.7.0...v0.7.1) (2019-04-23)

### Bug Fixes

- 修复 activeTab 失效问题 ([c785e38](https://github.com/whinc/web-console/commit/c785e38))

# [0.7.0](https://github.com/whinc/web-console/compare/v0.6.2...v0.7.0) (2019-04-23)

### Bug Fixes

- **plugin:** 修复 onWebConsoleShow 触发两次的问题;修复插件面板高度被改变的 bug ([bd88ddd](https://github.com/whinc/web-console/commit/bd88ddd))
- **plugin:** 修复插件生命周期未触发问题和插件重复问题 ([7c89fd6](https://github.com/whinc/web-console/commit/7c89fd6))
- 修复 lint 告警 ([82aedb5](https://github.com/whinc/web-console/commit/82aedb5))

### Features

- **plugin:** 初步支持插件的注册,展示,部分生命周期方法 ([513b530](https://github.com/whinc/web-console/commit/513b530))
- **plugin:** 增加插件获取当前设置的方法;增加插件首次加载设置的周期方法 ([0f5d129](https://github.com/whinc/web-console/commit/0f5d129))
- **plugin:** 增强插件支持 ([342a499](https://github.com/whinc/web-console/commit/342a499))
- **plugin:** 新增几种内置组件暴露给插件使用 ([a17c840](https://github.com/whinc/web-console/commit/a17c840))
- 更新在线 demo ([3275f42](https://github.com/whinc/web-console/commit/3275f42))

## [0.6.2](https://github.com/whinc/web-console/compare/v0.6.1...v0.6.2) (2019-03-26)

### Bug Fixes

- **network:** 修复部分情况下请求参数未展示的 bug ([edeff31](https://github.com/whinc/web-console/commit/edeff31))

## [0.6.1](https://github.com/whinc/web-console/compare/v0.6.0...v0.6.1) (2019-03-24)

### Bug Fixes

- **network:** 修复样式 ([f815474](https://github.com/whinc/web-console/commit/f815474))

# [0.6.0](https://github.com/whinc/web-console/compare/v0.5.0...v0.6.0) (2019-03-24)

### Bug Fixes

- **network:** 修复 fetch 请求参数为 Request 时的异常 ([e4739b6](https://github.com/whinc/web-console/commit/e4739b6))
- **network:** 修复请求状态展示错误 ([74f53b6](https://github.com/whinc/web-console/commit/74f53b6))

### Features

- **network:** 初步支持 fetch 请求 ([5e64f03](https://github.com/whinc/web-console/commit/5e64f03))
- **settings:** 支持设置"显示/隐藏"网络请求类型 ([b70cad5](https://github.com/whinc/web-console/commit/b70cad5))

# [0.5.0](https://github.com/whinc/web-console/compare/v0.4.7...v0.5.0) (2019-03-16)

### Bug Fixes

- 修复 lint 警告 ([e21046e](https://github.com/whinc/web-console/commit/e21046e))

### Features

- **console:** 增加搜索日志 ([8c90bac](https://github.com/whinc/web-console/commit/8c90bac))

## [0.4.7](https://github.com/whinc/web-console/compare/v0.4.6...v0.4.7) (2019-03-07)

### Bug Fixes

- 修复 vue-infinite-scroll 插件与宿主环境冲突,导致宿主引入该插件后无效的问题 ([8a89a15](https://github.com/whinc/web-console/commit/8a89a15))

## [0.4.6](https://github.com/whinc/web-console/compare/v0.4.4...v0.4.6) (2019-03-04)

### Bug Fixes

- 修复 PC 端滚动条覆盖面板右边缘的问题 ([bd03c0c](https://github.com/whinc/web-console/commit/bd03c0c))
- **application:** 输入框设置高度撑破父元素的问题 ([dbbfa9c](https://github.com/whinc/web-console/commit/dbbfa9c))
- **console:** 将输出内容对齐到每行的顶部 ([85a0c5f](https://github.com/whinc/web-console/commit/85a0c5f))
- **element:** 修复<br>标签不换行导致的 element 面板中盒模型样式坍塌问题 ([1a6cd8b](https://github.com/whinc/web-console/commit/1a6cd8b))

### Reverts

- px 单位转 vw 单位 ([93c52b8](https://github.com/whinc/web-console/commit/93c52b8))

## [0.4.4](https://github.com/whinc/web-console/compare/v0.4.2...v0.4.4) (2019-03-01)

### Bug Fixes

- **console:** 修复打印多参数时参数之间无空白符分隔的问题 ([7c7c525](https://github.com/whinc/web-console/commit/7c7c525))

### Features

- **settings:** 增加反馈入口 ([26984b9](https://github.com/whinc/web-console/commit/26984b9))

## [0.4.2](https://github.com/whinc/web-console/compare/v0.4.1...v0.4.2) (2019-02-26)

### Features

- **console:** 处理未捕获的异常(error 和 unhandledrejection 事件) ([04e7da5](https://github.com/whinc/web-console/commit/04e7da5))

## [0.4.1](https://github.com/whinc/web-console/compare/v0.4.0-beta.2...v0.4.1) (2019-02-21)

### Bug Fixes

- **console:** 修复 Symbole 作为对象 key 时,打印对象报错的问题 ([27ff599](https://github.com/whinc/web-console/commit/27ff599))
- **console:** 修复打印数组时末尾多出一个逗号 ([5b5e04d](https://github.com/whinc/web-console/commit/5b5e04d))

### Features

- **console:** log 格式输出支持 %c 占位符 ([0ba036d](https://github.com/whinc/web-console/commit/0ba036d))

# [0.4.0-beta.2](https://github.com/whinc/web-console/compare/v0.4.0-beta.1...v0.4.0-beta.2) (2019-02-18)

### Bug Fixes

- **element:** 修复 Element.prototype.getAttributeNames 的兼容性问题 ([92b0355](https://github.com/whinc/web-console/commit/92b0355))

# [0.4.0-beta.1](https://github.com/whinc/web-console/compare/v0.3.0-beta.6...v0.4.0-beta.1) (2019-02-16)

### Bug Fixes

- **application:** 修复选中行没有高亮颜色的 bug ([33a4633](https://github.com/whinc/web-console/commit/33a4633))

### Features

- **element:** 展示元素计算属性的继承值 ([072fbf2](https://github.com/whinc/web-console/commit/072fbf2))
- **element:** 计算属性面板的颜色值增加颜色小方块展示 ([65987d2](https://github.com/whinc/web-console/commit/65987d2))

# [0.3.0-beta.6](https://github.com/whinc/web-console/compare/v0.3.0-beta.5...v0.3.0-beta.6) (2019-02-01)

### Bug Fixes

- 去除 ios 默认的 tap 高亮效果 ([873c02c](https://github.com/whinc/web-console/commit/873c02c))
- 无法复制文本的问题 ([a224c2e](https://github.com/whinc/web-console/commit/a224c2e))
- **components:** 修复 TabBar 组件子项超出宽度部分不可见的问题 ([56b7c40](https://github.com/whinc/web-console/commit/56b7c40))
- **console:** 优化消息换行展示 ([ed0567a](https://github.com/whinc/web-console/commit/ed0567a))
- **console:** 修复 Element.prototype.scrollTo 兼容性问题 ([70d3410](https://github.com/whinc/web-console/commit/70d3410))
- **console:** 修复数组包含非数字下标时的展示问题 ([0e9de4f](https://github.com/whinc/web-console/commit/0e9de4f))
- **element:** 修复审查分组选择器匹配元素时报错问题 ([fb43814](https://github.com/whinc/web-console/commit/fb43814))
- **element:** 修复样式被宿主样式覆盖的 bug ([3e218ba](https://github.com/whinc/web-console/commit/3e218ba))
- **element:** 禁止审查 doctype 元素 ([bc7cea6](https://github.com/whinc/web-console/commit/bc7cea6))
- **element:** 隐藏 dom paths 的滚动条 ([e13e27b](https://github.com/whinc/web-console/commit/e13e27b))

### Features

- **element:** dom path 紧凑展示时优先展示元素 id ([24e631f](https://github.com/whinc/web-console/commit/24e631f))
- **element:** 元素审查的 computed 面板增加盒模型 ([883ac26](https://github.com/whinc/web-console/commit/883ac26))
- **element:** 元素审查面板新增计算样式 ([ce87971](https://github.com/whinc/web-console/commit/ce87971))
- **element:** 审查元素的 styles 面板增加盒模型 ([fd83e9a](https://github.com/whinc/web-console/commit/fd83e9a))
- **element:** 支持属性值中颜色值预览 ([8acb299](https://github.com/whinc/web-console/commit/8acb299))
- **element:** 支持显示 doctype 元素 ([47f862d](https://github.com/whinc/web-console/commit/47f862d))
- **element:** 新增 DOM 路径 ([4d41b3c](https://github.com/whinc/web-console/commit/4d41b3c))
- **element:** 新增属性缩写形式折叠展开 ([02b952d](https://github.com/whinc/web-console/commit/02b952d))
- **element:** 美化元素审查面板样式 ([e5309b3](https://github.com/whinc/web-console/commit/e5309b3))
- **element:** 计算样式增加获取继承样式的方法 ([6934b5a](https://github.com/whinc/web-console/commit/6934b5a))
- **element:** 选中底部 dom paths 时 dom tree 自动滚动到可视区域 ([22d6b1e](https://github.com/whinc/web-console/commit/22d6b1e))

# [0.3.0-beta.5](https://github.com/whinc/web-console/compare/v0.3.0-beta.4...v0.3.0-beta.5) (2018-12-06)

### Features

- **application:** 调整底部清除和刷新范围；删除存储数据增加二次确认弹窗 ([1953419](https://github.com/whinc/web-console/commit/1953419))
- **element:** 支持审查元素样式 ([26344f6](https://github.com/whinc/web-console/commit/26344f6))
- **settings:** 增加 CHANGELOG ([7e92468](https://github.com/whinc/web-console/commit/7e92468))

### Performance Improvements

- **console:** 提升批量打印日志时的显示性能 ([776891e](https://github.com/whinc/web-console/commit/776891e))

# [0.3.0-beta.4](https://github.com/whinc/web-console/compare/v0.3.0-beta.3...v0.3.0-beta.4) (2018-12-03)

### Bug Fixes

- **network:** 修复底部隐藏按钮失效问题 ([a0d2269](https://github.com/whinc/web-console/commit/a0d2269))

### Features

- **application:** 支持折叠工具栏 ([ca20bfd](https://github.com/whinc/web-console/commit/ca20bfd))
- **application:** 新增刷新全部和清除全部快捷按钮 ([fd4e4b4](https://github.com/whinc/web-console/commit/fd4e4b4))

# [0.3.0-beta.3](https://github.com/whinc/web-console/compare/v0.3.0-beta.2...v0.3.0-beta.3) (2018-12-03)

### Bug Fixes

- **element:** 修复同时选中开始和结束标签的问题 ([6a0cb15](https://github.com/whinc/web-console/commit/6a0cb15))
- **settings:** 移除 input 的 appearance 样式 ([fa9a0fe](https://github.com/whinc/web-console/commit/fa9a0fe))
- **settings:** 移除 About 页标题地下多出的横线 ([14e8cde](https://github.com/whinc/web-console/commit/14e8cde))

### Features

- **application:** 增加底部隐藏按钮 ([5eb10fe](https://github.com/whinc/web-console/commit/5eb10fe))
- **element:** 优化元素选中态样式；支持指定 DOM 树展开深度 ([76bb6d3](https://github.com/whinc/web-console/commit/76bb6d3))
- **element:** 增加元素审查面板 ([03e82f8](https://github.com/whinc/web-console/commit/03e82f8))
- **element:** 支持无内容标签的正确显示 ([cd31e3e](https://github.com/whinc/web-console/commit/cd31e3e))
- **element:** 节点显式过长时自动换行 ([aa89681](https://github.com/whinc/web-console/commit/aa89681))

# [0.3.0-beta.2](https://github.com/whinc/web-console/compare/v0.3.0-beta.1...v0.3.0-beta.2) (2018-11-29)

### Bug Fixes

- **settings:** 移除 input 的 appearance 样式 ([c7a25b1](https://github.com/whinc/web-console/commit/c7a25b1))

### Features

- **element:** 元素增加折叠展开箭头 ([d000198](https://github.com/whinc/web-console/commit/d000198))
- **element:** 支持显式 html 结构 ([fbac371](https://github.com/whinc/web-console/commit/fbac371))

# [0.3.0-beta.1](https://github.com/whinc/web-console/compare/0.3.0-beta.1...v0.3.0-beta.1) (2018-11-24)

### Bug Fixes

- **application:** 分页加载边界条件判断错误 ([0f18ca1](https://github.com/whinc/web-console/commit/0f18ca1))
- **application:** 删除后自动选中下一项 ([3007755](https://github.com/whinc/web-console/commit/3007755))
- **application:** 删除并重新写入 cookie 不更新 ([477c0fa](https://github.com/whinc/web-console/commit/477c0fa))
- **application:** 移除 IOS 输入框边框；弹窗可见时阻止 IOS 上缩放行为 ([31c50ec](https://github.com/whinc/web-console/commit/31c50ec))

### Performance Improvements

- **application:** 优化修改和删除操作的性能 ([c376187](https://github.com/whinc/web-console/commit/c376187))
- **application:** 大幅提升展示大量(1W+)storage 和 cookie 的性能 ([66b8c45](https://github.com/whinc/web-console/commit/66b8c45))

# [0.3.0-beta.0](https://github.com/whinc/web-console/compare/v0.2.0-rc.15...v0.3.0-beta.0) (2018-11-20)

### Bug Fixes

- **application:** cookie 操作 ([01dc531](https://github.com/whinc/web-console/commit/01dc531))
- **application:** 异常 ([bf80d3b](https://github.com/whinc/web-console/commit/bf80d3b))
- **application:** 样式问题 ([c41b07c](https://github.com/whinc/web-console/commit/c41b07c))
- **network:** 解决 ios 上网络面板无法滚动问题 ([a3d39a6](https://github.com/whinc/web-console/commit/a3d39a6))

### Features

- **application:** localStorage 和 sessionStorage 支持编辑、新增 ([3cef20c](https://github.com/whinc/web-console/commit/3cef20c))
- **application:** 优化编辑状态样式 ([10e7727](https://github.com/whinc/web-console/commit/10e7727))
- **application:** 固定表头滚动表内容 ([9624ea3](https://github.com/whinc/web-console/commit/9624ea3))
- **application:** 增加 value 的过滤 ([84eddef](https://github.com/whinc/web-console/commit/84eddef))
- **application:** 增加对 cookie 的编辑和新增操作 ([273af90](https://github.com/whinc/web-console/commit/273af90))
- **application:** 新增 localStorage 和 sessionStorage ([292f863](https://github.com/whinc/web-console/commit/292f863))
- **application:** 美化 cookie 面板 ([4deefb9](https://github.com/whinc/web-console/commit/4deefb9))
- **application:** 表格增加奇偶行色差 ([e8996e8](https://github.com/whinc/web-console/commit/e8996e8))
- **console:** 增加最大消息数量限制 ([d69e15c](https://github.com/whinc/web-console/commit/d69e15c))

### Performance Improvements

- 用 v-if 替换部分 v-show 提高性能 ([1ec40f2](https://github.com/whinc/web-console/commit/1ec40f2))
- **application:** 优化保存性能 ([802c87f](https://github.com/whinc/web-console/commit/802c87f))
- **application:** 提高巨量(1w+)storage 条目的展示性能 ([258568d](https://github.com/whinc/web-console/commit/258568d))
- **console:** 优化短期内批量打印日志造成的 UI 假死现象 ([53be149](https://github.com/whinc/web-console/commit/53be149))

# [0.2.0-rc.15](https://github.com/whinc/web-console/compare/v0.2.0-rc.14...v0.2.0-rc.15) (2018-11-08)

# [0.2.0-rc.14](https://github.com/whinc/web-console/compare/v0.2.0-rc.13...v0.2.0-rc.14) (2018-11-08)

### Bug Fixes

- **console:** ios 上滚动失效 ([c282ad5](https://github.com/whinc/web-console/commit/c282ad5))
- **console:** 美化 safari 上输出的错误堆栈信息 ([4634cfa](https://github.com/whinc/web-console/commit/4634cfa))
- **settings:** ios 上图标展示过大 ([66f7beb](https://github.com/whinc/web-console/commit/66f7beb))

### Features

- **console:** 增加时间戳 ([ec6752c](https://github.com/whinc/web-console/commit/ec6752c))
- **settings:** 增加设置面板 ([89c4492](https://github.com/whinc/web-console/commit/89c4492))
- **settings:** 增加设置项持久化 ([1f542bc](https://github.com/whinc/web-console/commit/1f542bc))

# [0.2.0-rc.13](https://github.com/whinc/web-console/compare/v0.2.0-rc.12...v0.2.0-rc.13) (2018-11-06)

### Bug Fixes

- **console:** 循环打印错误日志 ([a570170](https://github.com/whinc/web-console/commit/a570170))

### Features

- **console:** 缩略展示长字符串 ([a7af920](https://github.com/whinc/web-console/commit/a7af920))

# [0.2.0-rc.12](https://github.com/whinc/web-console/compare/v0.2.0-rc.11...v0.2.0-rc.12) (2018-11-05)

### Features

- **application:** 实现 cookie 的展示、删除、过滤、刷新 ([0a26517](https://github.com/whinc/web-console/commit/0a26517))

# [0.2.0-rc.11](https://github.com/whinc/web-console/compare/v0.2.0-rc.10...v0.2.0-rc.11) (2018-10-31)

### Features

- 增加设置(展示版本信息) ([6ab8caa](https://github.com/whinc/web-console/commit/6ab8caa))

# [0.2.0-rc.10](https://github.com/whinc/web-console/compare/v0.2.0-rc.9...v0.2.0-rc.10) (2018-10-30)

### Bug Fixes

- **console:** 保留消息换行符 ([2d75a7c](https://github.com/whinc/web-console/commit/2d75a7c))
- **console:** 数组展示 ([8b8faa0](https://github.com/whinc/web-console/commit/8b8faa0))

### Features

- **application:** 增加 cookie 展示 ([4df4f8c](https://github.com/whinc/web-console/commit/4df4f8c))
- **application:** 新增 Application 面板 ([91daa76](https://github.com/whinc/web-console/commit/91daa76))
- **application:** 新增 cookie/localStorage/sessionStorage 的 UI ([aac507d](https://github.com/whinc/web-console/commit/aac507d))
- **console:** 打印 Error 对象堆栈信息 ([599206b](https://github.com/whinc/web-console/commit/599206b))
- **console:** 输出日志时可自动定位到最新位置 ([2509392](https://github.com/whinc/web-console/commit/2509392))

# [0.2.0-rc.9](https://github.com/whinc/web-console/compare/v0.2.0-rc.7...v0.2.0-rc.9) (2018-10-26)

### Performance Improvements

- **console:** 提升面板切换性能 ([a068d6c](https://github.com/whinc/web-console/commit/a068d6c))

# [0.2.0-rc.7](https://github.com/whinc/web-console/compare/v0.2.0-rc.6...v0.2.0-rc.7) (2018-10-09)

# [0.2.0-rc.6](https://github.com/whinc/web-console/compare/v0.2.0-rc.5...v0.2.0-rc.6) (2018-10-09)

### Features

- **network:** 响应数据增加语法高亮 ([dcc3df7](https://github.com/whinc/web-console/commit/dcc3df7))
- **network:** 增加 JSON 数据预览 ([a099205](https://github.com/whinc/web-console/commit/a099205))
- **network:** 增加响应数据预览 ([0bb4e95](https://github.com/whinc/web-console/commit/0bb4e95))
- **network:** 支持预览 gif/jpg/svg/txt ([72fcd52](https://github.com/whinc/web-console/commit/72fcd52))

# [0.2.0-rc.5](https://github.com/whinc/web-console/compare/v0.2.0-rc.4...v0.2.0-rc.5) (2018-09-14)

### Bug Fixes

- 修复触摸滚动穿透问题 ([f017338](https://github.com/whinc/web-console/commit/f017338))

# [0.2.0-rc.4](https://github.com/whinc/web-console/compare/v0.2.0-rc.3...v0.2.0-rc.4) (2018-09-11)

### Bug Fixes

- **network:** response 数据超出边界时无法滚动查看 ([4111487](https://github.com/whinc/web-console/commit/4111487))

# [0.2.0-rc.3](https://github.com/whinc/web-console/compare/v0.2.0-rc.2...v0.2.0-rc.3) (2018-09-10)

### Bug Fixes

- **console:** 未正确识别占位符 %c 导致的显示问题 ([c740d16](https://github.com/whinc/web-console/commit/c740d16))
- 面板可见时悬浮按钮未隐藏 ([41f8af5](https://github.com/whinc/web-console/commit/41f8af5))

# [0.2.0-rc.2](https://github.com/whinc/web-console/compare/v0.2.0-rc.1...v0.2.0-rc.2) (2018-09-08)

# [0.2.0-rc.1](https://github.com/whinc/web-console/compare/v0.1.5...v0.2.0-rc.1) (2018-09-08)

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

## [0.1.5](https://github.com/whinc/web-console/compare/v0.1.4...v0.1.5) (2018-06-20)

## [0.1.4](https://github.com/whinc/web-console/compare/v0.1.3...v0.1.4) (2018-06-20)

## [0.1.3](https://github.com/whinc/web-console/compare/v0.1.2...v0.1.3) (2018-06-20)

## [0.1.2](https://github.com/whinc/web-console/compare/v0.1.1...v0.1.2) (2018-06-12)

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
