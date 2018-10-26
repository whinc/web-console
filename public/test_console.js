window.$console = (function() {
  // 测试log格式化输出
  function testLogFormat(value, format) {
    console.log("console.log(%" + format + ", %s)", JSON.stringify(value));
    console.log(format, value);
  }

  function testException() {
    throw new Error("xxx");
  }

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
    testException: testException
  };
})();
