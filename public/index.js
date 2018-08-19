new Vue({
  el: "#app",
  data: function() {
    return {
      // isDev: false
      isDev: true
    };
  },
  mounted: function() {
    this.launchWebConsole();
  },
  methods: {
    launchWebConsole: function() {
      var self = this;
      if (window.WebConsole) {
        WebConsole.init({
          // activeTab: 'console',
          // panelVisible: false
          activeTab: "network",
          panelVisible: true
        });
        this.onClickAjax("xhr_get");
        this.onClickAjax("xhr_post");
      } else {
        setTimeout(function() {
          self.launchWebConsole();
        }, 200);
      }
    },
    onClickPrint: function(type) {
      var numInt = 1;
      var numFloat = 1.23;
      var str = "hello";
      var obj = {
        a: 1,
        b: 2,
        c: {
          d: 3
        }
      };
      var arr = [1, 2, [3, obj]];
      switch (type) {
        case "log":
          console.log("log");
          break;
        case "info":
          console.info("info");
          break;
        case "debug":
          console.debug("debug");
          break;
        case "warn":
          console.warn("warn");
          break;
        case "error":
          console.error("error");
          break;
        case "log_level":
          console.log("log");
          console.info("info");
          console.debug("debug");
          console.warn("warn");
          console.error("error");
          break;
        case "log_params":
          console.log("aa", 100, true, null, undefined, { a: "a" }, Symbol());
          break;
        case "log_format":
          // 测试占位符的支持类型
          testLogFormat(numInt, "%i");
          testLogFormat(numFloat, "%i");
          testLogFormat(numInt, "%d");
          testLogFormat(numFloat, "%d");
          testLogFormat(numInt, "%f");
          testLogFormat(numFloat, "%f");
          testLogFormat(obj, "%s");
          testLogFormat(obj, "%o");
          testLogFormat(arr, "%o");
          testLogFormat(obj, "%O");
          testLogFormat(arr, "%O");
          // 测试占位符缺少对应的参数
          console.log('console.log("-%s%i%d%f%o%O%c-")');
          console.log("-%s%i%d%f%o%O%c-");
          // 测试参数多余占位符
          console.log('console.log("-%s-", 99, {a: "1"})');
          console.log("-%s-", 99, { a: 1 });
          // 测试占位符和参数的高亮
          console.log(
            "console.log('%s-%s-%s-%s-%s-%s-%s', 100, true, null, undefined, '100', {}, [])"
          );
          console.log(
            "%s-%s-%s-%s-%s-%s-%s",
            100,
            true,
            null,
            undefined,
            "100",
            {},
            []
          );
          break;
        case "log_object":
          // console.log('obj:', {a: 1})
          // break
          // console.log('this is a object: ', obj, 'wa haha')
          // console.log({
          //   c: 3,
          //   b: 2,
          //   a: 1
          // })
          // break
          let obj2 = {
            // 测试数值类型
            a: 1,
            a5: { a: 1, b: 2, c: { a: 1, b: 2 } },
            // 测试数组
            a3: [1, 2],
            a4: [1, 2, [1, 2, [1, 2, 3], 3], 3],
            // 测试属性值很长时的展示
            a1: "10101010101010101010101010101010101010101010101001010101",
            a2: 10101010101010101010110101010101010110101011010101011010101,
            // 测试字符串类型
            b: "b",
            // 测试转义字符展示
            b1: '"b1"',
            c: true,
            d: undefined,
            e: null,
            f: Symbol(),
            g: {
              a: 1,
              f1: () => {
                return 1;
              },
              f2: function() {
                return 2;
              },
              b: "b",
              c: {
                a: 1,
                b: "b"
              },
              d: undefined,
              e: null
            },
            [Symbol()]: 10,
            [Symbol("age")]: 28,
            f1: function() {},
            f2: () => {},
            f3: function say() {},
            Z: "Z",
            M: "m",
            z: "z",
            // 测试排序规则
            __a: "public __a",
            _a: "public _a",
            $a: "public $a"
          };
          Object.defineProperties(obj2, {
            // value
            h: {
              enumerable: true,
              configurable: true,
              value: 10,
              writable: false
            },
            // value
            i: {
              enumerable: false,
              configurable: false,
              value: 10,
              writable: true
            },
            // getter and setter
            j: {
              get: () => {
                return Math.random() + "";
              },
              set: v => {}
            },
            J: {
              get: () => {
                return "" + Math.random();
              },
              set: v => {}
            },
            // only getter
            k: {
              get: function() {
                return {
                  a: 1,
                  b: "b"
                };
              }
            },
            K: {
              get: function() {
                return [
                  {
                    a: 1,
                    b: "b"
                  }
                ];
              }
            },
            // only setter
            l: {
              set: function(v) {}
            },
            [Symbol("a")]: {
              value: "1",
              enumerable: false
            },
            // 测试属性排序规则
            __b: {
              value: "private __b",
              enumerable: false
            },
            _b: {
              value: "private _b",
              enumerable: false
            },
            $b: {
              value: "private $b",
              enumerable: false
            }
          });
          Object.defineProperties(obj2.g, {
            h: {
              enumerable: true,
              configurable: true,
              value: 10
            },
            i: {
              enumerable: false,
              configurable: false,
              value: 10
            },
            j: {
              get: () => {
                return Math.random();
              },
              set: v => {}
            },
            k: {
              get: function() {
                return Math.random();
              },
              set: function() {}
            }
          });
          Object.defineProperties(obj2.g.c, {
            c: {
              enumerable: false,
              configurable: false,
              value: 10
            },
            d: {
              get: function() {
                return Math.random();
              },
              set: function() {}
            }
          });
          window.obj2 = obj2;
          console.log("obj2:", obj2);
          console.log({
            f1: function() {},
            f2: () => {},
            f3: function say() {}
          });
          var arr2 = [
            1,
            2,
            {
              a: 1
            }
          ];
          console.log(arr2);
          break;
      }
    },
    onClickAjax(type) {
      var server = "http://localhost:8090";
      switch (type) {
        case "xhr_get":
          var xhr = new window.XMLHttpRequest();
          xhr.open("GET", server + "/get");
          xhr.onreadystatechange = function() {
            console.log("readyState:", this.readyState);
          };
          xhr.send();

          ajax({
            url: "http://mta.qq.com/h5/api/ctr_core_data"
          });
          // setTimeout(() => {
          //   xhr.onreadystatechange = function () {
          //     console.log('readyState:', this.readyState)
          //   }
          // })
          break;
        case "xhr_post":
          // var xhr = new window.XMLHttpRequest()
          // xhr.open('POST', server + '/post')
          // const data = {
          //   name: 'whincwu'
          // }
          // xhr.send(JSON.stringify(data))
          break;
      }
    }
  }
});

function ajax(options) {
  options = options || {};
  var url = options.url;
  var method = options.method || "GET";

  var xhr = new window.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    console.log("readyState:", this.readyState);
  };
  xhr.open(method, url);
  xhr.send();
}

// 测试log格式化输出
function testLogFormat(value, format) {
  console.log("console.log(%" + format + ", %s)", JSON.stringify(value));
  console.log(format, value);
}