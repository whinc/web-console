# web-console 插件开发

web-console 插件开发很简单，每个插件都是一个 Vue 组件，你可以利用 Vue 强大能力编写插件。同时 web-console 提供了一些插件生命周期方法，使你可以在组件中针对各个时间做出相应的处理。

插件命名`web-console-plugin-<name>`，如 `web-console-plugin-source`

插件开发模板，方便快速编写插件，支持本地调试、热更新和热重载、一键发布到 npm 仓库。

## 注册插件

web-console 插件是一个对象

```
{
  // 插件名称
  name: string
  // Vue 组件
  component: VueComponent
}
```

插件组件中已经注入了一些 web-console 预定义的组件，如`VFootBar`

## 插件生命周期

## 在设置面板中增加插件设置
