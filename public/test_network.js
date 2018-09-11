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

  return {
    // 测试 HTTP 状态码
    testHTTPStatus: function() {
      [100, 200, 300, 400, 500].forEach(function(status) {
        ajax({ url: baseURL + "/get_status/" + status });
      });
      ajax({ url: "https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=15850781443" });
      ajax({
        url: "https://www.baifubao.com/callback?cmd=1059&callback=phone&phone=15850781443"
      });
    },
    testRequestParams: function() {
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
    },
    // 测试响应数据类型
    testResponseData() {
      ajax({
        url: baseURL + "/get_data/?mime_type=" + encodeURIComponent("application/json")
      });
    }
  };
})();
