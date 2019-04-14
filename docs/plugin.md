# web-console 插件开发

web-console 插件开发很简单，每个插件都是一个 Vue 组件，你可以利用 Vue 强大能力编写插件。同时 web-console 提供了一些插件生命周期方法，使你可以在组件中针对各个时间做出相应的处理。

插件命名`web-console-plugin-<name>`，如 `web-console-plugin-source`

插件开发模板，方便快速编写插件，支持本地调试、热更新和热重载、一键发布到 npm 仓库。

## 创建插件

每个插件都是`WebConsole.Plugin`类的一个实例，创建插件方法如下：

```js
const plugin = new WebConsole.Plugin(config);
```

其中参数`config`的取值如下：
|字段|类型|必填|备注|
|-|-|-|-|
|id|string|true|不能与已安装的插件 id 相同|
|name|string|false|插件名称，用于显示，缺省时与 id 相同|
|component|VueComponent|true|插件主面板，是一个 Vue 组件|
|settings|Object|false|增加到设置面板的设置项|

> 参数配置中的 component 注入了一些 web-console 组件，可以直接使用。

## 注册插件

在实例化 WebConsole 时传入插件即可，例如：

```js
new WebConsole({
  plugins: [plugin1, plugin2, ...]
})
```

## 插件生命周期

目前插件支持如下生命周期方法：

| 生命周期方法                                        | 执行时机                     | 备注                          |
| --------------------------------------------------- | ---------------------------- | ----------------------------- |
| `onWebConsoleReady(hostProxy)`                      | 主面板首次渲染完成时         | 可访问 DOM 和配置，仅执行一次 |
| `onWebConsoleShow(hostProxy)`                       | 主面板从不可见变为**可见**时 |                               |
| `onWebConsoleHide(hostProxy)`                       | 主面板从可见变为**不可见**时 |
| `onWebConsoleTabChanged(hostProxy, newTab, oldTab)` | 切换不同子面板时             |
| `onWebConsoleSettingsLoaded(hostProxy, settings)`   | 偏好设置首次加载时           |
| `onWebConsoleSettingsChanged(hostProxy, settings)`  | 偏好设置变化时               |

## 插件偏好设置

web-console 有自己的偏好设置界面，插件也可以在其中添加自己的偏好设置项，添加方式是在创建插件时指定`settings`属性，该属性接受一个数组，数组每个元素对应一个表单元素，支持的表单元素如下。

```js
new WebConsole.Plugin({
  ...,
  settings: [
    {
      // bool 选择
      type: "checkbox",
      desc: "是否选中",
      name: "isChecked",
      value: false,
    },
    {
      // 在多个选项中选一个
      type: "select",
      desc: "Max message count: ",
      name: "maxMsgCount",
      value: 400,
      options: [
        { text: "200", value: 200 },
        { text: "400", value: 400 },
        { text: "800", value: 800 },
        { text: "1600", value: 1600 },
        { text: "Infinity", value: Number.MAX_VALUE }
      ]
    }
  ]
})
```
