# chap6

## body-parser 的使用

1.  安装

```shell
$ npm install body-parser
```

2.  使用

```js
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.write("you posted:\n");
  res.end(JSON.stringify(req.body, null, 2));
});
```

body-parser 不支持处理 multipart bodies ,如果处理复合表单数据，可以使用一下插件：
busboy and connect-busboy
multiparty and connect-multiparty
formidable
multer
