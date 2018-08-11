var http = require('http');
var fs = require('fs');
const url = require('url')

const routes = {
  '/get': function (req, res) {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain; charset=utf-8'
    })
    res.end('get')
  },
  '/post': function (req, res) {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain; charset=utf-8'
    })
    res.end('post')
  }
}
 
const httpServer = http.createServer(function (req, res) {  
   const urlObj = url.parse(req.url)
   const pathname = urlObj.pathname
   console.log('received request:', pathname)

   if (typeof routes[pathname] === 'function') {
     routes[pathname](req, res)
   } else {
     res.writeHead(404, {'Content-Type': 'text/html'})
     res.end()
   }
}).listen(8090);
 
// 控制台会输出以下信息
console.log('Server running at http://localhost:' + httpServer.address().port)
