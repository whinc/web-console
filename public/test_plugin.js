function plugin1(WebConsole) {
  return new WebConsole.Plugin({
    id: "plugin1",
    name: "插件1",
    component: function() {
      var plugin = this;
      var tag = plugin.toString();
      return {
        data: function() {
          return {
            text: "plugin1 panel",
            activeTab: "A"
          };
        },
        methods: {
          onWebConsoleReady: function(hostProxy) {
            this.hostProxy = hostProxy;
            console.log(tag, "onWebConsoleReady");
          },
          onWebConsoleShow: function(hostProxy) {
            console.log(tag, "onWebConsoleShow");
          },
          onWebConsoleHide: function(hostProxy) {
            console.log(tag, "onWebConsoleHide");
          },
          onWebConsoleTabChanged: function(hostProxy, newVal, oldVal) {
            console.log(tag, "onWebConsoleTabChanged", newVal);
          },
          onWebConsoleSettingsLoaded: function(hostProxy, settings) {
            console.log(tag, "onWebConsoleSettingsLoaded", settings);
          },
          onWebConsoleSettingsChanged: function(hostProxy, settings) {
            console.log(tag, "onWebConsoleSettingsChanged", settings);
          },
          hidePanel: function() {
            this.hostProxy.hidePanel();
          },
          printSettings: function() {
            console.log("settings:", this.hostProxy.getSettings());
          }
        },
        render: function(h) {
          var vm = this;
          return h(
            "div",
            {
              style: {
                display: "flex",
                "flex-direction": "column"
              }
            },
            [
              h(
                "div",
                {
                  style: {
                    flex: "1"
                  }
                },
                [
                  h(
                    "button",
                    {
                      on: {
                        click: this.hidePanel
                      }
                    },
                    "hide panel"
                  ),
                  h(
                    "button",
                    {
                      style: {
                        "margin-left": "10px"
                      },
                      on: {
                        click: this.printSettings
                      }
                    },
                    "print settings"
                  ),
                  h(
                    "div",
                    {
                      style: {
                        "margin-top": "20px",
                        display: "flex",
                        "flex-direction": "row"
                      }
                    },
                    ["setting", "close", "refresh", "ban", "edit", "save", "add", "cancel", "expand", "collapse"].map(
                      name =>
                        h("VIcon", {
                          style: {
                            "margin-left": "10px",
                            width: "20px",
                            height: "20px"
                          },
                          props: {
                            name: name
                          }
                        })
                    )
                  )
                ]
              ),
              h("VJSONViewer", {
                props: {
                  value: { a: 1, b: "2", c: { a: 1, b: "2" } }
                }
              }),
              h("VHighlightView", {
                props: {
                  code: "var a = 1;\nvar b 2;\nconsole.log('a + b =', a + b)",
                  language: "javascript"
                }
              }),
              h(
                "VTabBar",
                {
                  props: {
                    value: vm.activeTab,
                    equalWidth: true
                  },
                  on: {
                    input: function(id) {
                      vm.activeTab = id;
                    }
                  }
                },
                [
                  h("VTabBarItem", { props: { id: "A" } }, "Tab1"),
                  h("VTabBarItem", { props: { id: "B" } }, "Tab2"),
                  h("VTabBarItem", { props: { id: "C" } }, "Tab3"),
                  h("VTabBarItem", { props: { id: "D" } }, "Tab4")
                ]
              ),
              h("v-foot-bar", {
                props: {
                  buttons: [
                    {
                      text: "Hide",
                      click: function() {
                        vm.hostProxy.hidePanel();
                      }
                    }
                  ]
                }
              }) // v-foot-bar
            ]
          ); // div
        }
      };
    },
    settings: [
      {
        type: "checkbox",
        name: "plugin0",
        value: false,
        desc: "test plugin0"
      }
    ]
  });
}

function plugin2(WebConsole) {
  return new WebConsole.Plugin({
    id: "plugin2",
    name: "插件2",
    component: {
      data: function() {
        return {
          text: "plugin2 panel"
        };
      },
      render: function(h) {
        return h("div", {}, this.text);
      }
    },
    settings: function() {
      return [
        {
          type: "checkbox",
          name: this.id,
          value: false,
          desc: "test " + this.id
        }
      ];
    }
  });
}

window.$plugins = [plugin1, plugin2];
