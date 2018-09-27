var http = require("http");
var fs = require("fs");
const url = require("url");

const routes = {
  "/get_data": function(req, res) {
    const queryParams = url.parse(req.url, true).query;
    const mimeType = queryParams["mime_type"];
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": mimeType || "text/plain"
    };
    res.writeHead(200, responseHeaders);

    // 参考 http://devdocs.io/http/basics_of_http/mime_types
    switch (mimeType) {
      case "application/octet-stream":
        break;
      case "text/javascript":
      case "application/javascript":
        fs.readFile("./data/response.js", function(err, data) {
          res.end(data);
        });
        break;
      case "application/json":
        fs.readFile("./data/response.json", function(err, data) {
          res.end(data);
        });
        break;
      case "image/jpeg":
        break;
      case "image/png":
        fs.readFile("./data/response.png", function(err, data) {
          res.end(data);
        });
        break;
      case "text/html":
        fs.readFile("./data/response.html", function(err, data) {
          res.end(data);
        });
        break;
      case "text/css":
        fs.readFile("./data/response.css", function(err, data) {
          res.end(data);
        });
        break;
      case "text/plain":
      default:
        res.end("this is a plain text.");
        break;
    }
  },
  // 获取不同的 HTTP 状态码
  "/get_status/\\d+": function(req, res) {
    const pathname = url.parse(req.url).pathname;
    const status = new RegExp("/get_status/(\\d+)").exec(pathname)[1];
    res.writeHead(status, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("response status: " + status);
  },
  "/get": function(req, res) {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("get hello");
  },
  "/post": function(req, res) {
    res.writeHead(200, {
      "Access-Control-Allow-Method": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("post");
  }
};

const httpServer = http
  .createServer(function(req, res) {
    const urlObj = url.parse(req.url);
    const pathname = urlObj.pathname;
    console.log("received request:", pathname);

    const key = Object.keys(routes).find(route => new RegExp(route).test(pathname));
    if (key) {
      routes[key](req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("404 Not Found");
    }

    //  if (typeof routes[pathname] === 'function') {
    //    routes[pathname](req, res)
    //  } else {
    //    res.writeHead(404, {'Content-Type': 'text/html'})
    //    res.end('404 Not Found')
    //  }
  })
  .listen(8090);

// 控制台会输出以下信息
console.log("Server running at http://localhost:" + httpServer.address().port);
