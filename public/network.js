window.network = (function() {
  var baseURL = "http://localhost:8090";

  function ajax(options) {
    options = options || {};
    var url = options.url;
    var method = options.method || "GET";

    var xhr = new window.XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //   console.log("readyState:", this.readyState);
    // };
    xhr.open(method, url);
    xhr.send();
  }

  return {
    // 测试 HTTP 状态码
    testHTTPStatus: function() {
      [100, 200, 300, 400, 500].forEach(function(status) {
        ajax({ url: baseURL + "/get_status/" + status });
      });
      ajax({
        url: "https://runkit.io/runkit/hello-world-api/1.0.0"
      });
      ajax({
        url: "https://runkit.io/runkit/hello-world-api/x.0.0"
      });
    },
    testRequestParams: function() {}
  };
})();
