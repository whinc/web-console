window.$console = (function() {
  // 测试log格式化输出
  function testLogFormat(value, format) {
    console.log("console.log(%" + format + ", %s)", JSON.stringify(value));
    console.log(format, value);
  }

  function testException() {
    // console.log(new Error('general error'))
    // console.error(new Error('general error'))
    console.error(new ReferenceError("reference error"));
    // throw new Error("xxx");
  }

  // 打印对象
  function testObject() {
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
    console.log("对象全属性:", obj2);
    console.log("三种函数:", {
      f1: function() {},
      f2: () => {},
      f3: function say() {}
    });
    var arr = [];
    arr["10"] = "10";
    arr["29"] = "29";
    arr[" "] = " "; // 0x20
    arr["  "] = "  ";
    arr[" a"] = " a";
    arr["  a"] = "  a"; // 空白符处理
    arr["!"] = "!"; // 0x21
    arr["0"] = "0"; // 0x30
    arr["1"] = "1"; // 0x31
    arr["2"] = "2"; // 0x31
    arr[":"] = ":"; // 0x3A
    arr["A"] = "A"; // 0x41
    arr["B"] = "B"; // 0x42
    arr["["] = "["; // 0x5B
    arr["a"] = "a"; // 0x61
    arr["b"] = "b"; // 0x62
    arr["{"] = "{"; // 0x7B
    console.log("数组 key 排序:", arr);
  }

  // 格式化输出
  function testFormat() {
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
    console.log("console.log('%s-%s-%s-%s-%s-%s-%s', 100, true, null, undefined, '100', {}, [])");
    console.log("%s-%s-%s-%s-%s-%s-%s", 100, true, null, undefined, "100", {}, []);
    // 测试占位符 %c 的展示
    console.log(
      `%cResponse%c %c params: %O data: %O`,
      "color: white; background-color: #FF4136B0; padding: 2px 5px; border-radius: 2px",
      "",
      "color: #FF4136",
      { a: 1 },
      { b: 2 }
    );
  }

  return {
    testFormat: testFormat,
    testException: testException,
    testObject: testObject
  };
})();
