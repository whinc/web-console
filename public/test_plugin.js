window.$plugins = function(WebConsole) {
  var plugin1 = new WebConsole.Plugin({
    id: "plugin1",
    name: "插件1",
    component: function() {
      var plugin = this;
      var tag = plugin.toString();
      return {
        data: function() {
          return {
            text: "plugin1 panel"
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
                  )
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

  var plugin2 = new WebConsole.Plugin({
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
    // onWebConsoleReady: function(hostProxy) {
    //   this.hostProxy = hostProxy;
    //   console.log(this.toString(), "onWebConsoleReady");
    // },
    // onWebConsoleShow: function(hostProxy) {
    //   console.log(this.toString(), "onWebConsoleShow");
    // },
    // onWebConsoleHide: function(hostProxy) {
    //   console.log(this.toString(), "onWebConsoleHide");
    // },
    // onWebConsoleTabChanged: function(hostProxy, newVal, oldVal) {
    //   console.log(this.toString(), "onWebConsoleTabChanged", newVal);
    // },
    // onWebConsoleSettingsLoaded: function(hostProxy, settings) {
    //   console.log(this.toString(), "onWebConsoleSettingsLoaded", settings);
    // },
    // onWebConsoleSettingsChanged: function(hostProxy, settings) {
    //   console.log(this.toString(), "onWebConsoleSettingsChanged", settings);
    // },
  });

  return [plugin1, plugin2];
};
