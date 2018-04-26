var http = require("http");
var fs = require("fs");
function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) {
    responseCode = 200;
  }
  console.log(__dirname + path);
  fs.readFile(__dirname + path, function(err, data) {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 -Internal Error");
    } else {
      res.writeHead(responseCode, {
        "Content-Type": contentType
      });
      res.end(data);
    }
  });
}
http
  .createServer(function(req, res) {
    var path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
    console.log(path);
    switch (path) {
      case "":
        serveStaticFile(res, "/public/home.html", "text/html");
        break;
      case "/about":
        serveStaticFile(res, "/public/about.html", "text/plain");
        break;
      case "/img/logo.png":
        serveStaticFile(res, "/public/img/logo.png", "image/png");
        break;
      default:
        serveStaticFile(res, "/public/404.html", "text/html");
        break;
    }
  })
  .listen(3300);
console.log("Server start");
