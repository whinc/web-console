window.$plugins = [
  {
    name: "插件1",
    component: {
      data: function() {
        return {
          text: "plugin1 panel"
        };
      },
      methods: {
        onWebConsoleReady: function(hostProxy) {
          this.hostProxy = hostProxy;
        },
        onWebConsoleShow: function(hostProxy) {
          console.log("web-console show");
        },
        onWebConsoleHide: function(hostProxy) {
          console.log("web-console hide");
        },
        onWebConsoleTabChanged: function(hostProxy, newVal, oldVal) {
          console.log("web-console tab changed: %s -> %s", oldVal, newVal);
        },
        onWebConsoleSettingsChanged: function(hostProxy, settings) {
          console.log("web-console settings changed: %o", settings);
        },
        hidePanel: function() {
          this.hostProxy.hidePanel();
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
    },
    settings: [
      {
        type: "checkbox",
        name: "plugin0",
        value: false,
        desc: "test plugin0"
      }
    ]
  },
  {
    name: "plugin2",
    component: {
      data: function() {
        return {
          text: "plugin2 panel"
        };
      },
      render: function(h) {
        return h("div", {}, this.text);
      }
    }
  }
];
