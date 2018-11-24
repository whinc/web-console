window.$network = (function() {
  var baseURL = "http://localhost:8090";

  function ajax(options) {
    options = options || {};
    var url = options.url;
    var method = options.method || "GET";
    var data = options.data || undefined;
    var requestHeaders = options.requestHeaders || {};

    var xhr = new window.XMLHttpRequest();
    // xhr.onreadystatechange = function() {
    //   console.log("readyState:", this.readyState);
    // };
    xhr.open(method, url);
    Object.keys(requestHeaders).forEach(key => {
      xhr.setRequestHeader(key, requestHeaders[key]);
    });
    xhr.send(data);
  }

  // 测试 HTTP 状态码
  function testHTTPStatus() {
    ajax({ url: "https://nodejs.org/dist/latest-v8.x/docs/api/index.json" });
    [100, 200, 300, 400, 500].forEach(function(status) {
      ajax({ url: baseURL + "/get_status/" + status });
    });
  }

  /**
   * 测试请求参数
   */
  function testRequestParams() {
    // GET
    ajax({ url: baseURL + "/get?a=1&b=2&c=&d" });
    var email = "xx@yy.com";
    var password = "zz";
    // POST：plain text
    ajax({
      url: baseURL + "/post",
      method: "POST",
      data: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password)
    });
    // POST：Form Data
    ajax({
      url: baseURL + "/post",
      method: "POST",
      requestHeaders: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password)
    });
    // POST: JSON
    ajax({
      url: baseURL + "/post",
      method: "POST",
      requestHeaders: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: JSON.stringify({
        email: email,
        password: password
      })
      // data: '{"email": aa}'
    });
    // POST: JSON with invalid format
    ajax({
      url: baseURL + "/post",
      method: "POST",
      requestHeaders: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: '{"email": aa}'
    });
  }

  // 测试响应数据类型
  // 参考 http://devdocs.io/http/basics_of_http/mime_types
  function testResponseData() {
    const mimeTypeList = [
      "application/json",
      "application/javascript",
      "text/css",
      "text/plain",
      "text/html",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml"
    ];

    mimeTypeList.forEach(mimeType => {
      ajax({ url: baseURL + "/get_data/?mime_type=" + encodeURIComponent(mimeType) });
    });
  }

  return {
    testHTTPStatus: testHTTPStatus,
    testResponseData: testResponseData,
    testRequestParams: testRequestParams
  };
})();
