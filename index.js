var express = require('express');
var bodyParser = require('body-parser');
var formidable = require('formidable');
upload = require('jquery-file-upload-middleware');
var credentials = require('./src/credentials');

console.log(__dirname);

// 设置视图引擎
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._section) this._section = {};
            this._section[name] = options.fn(this);
            return null;
        }
    }
});
var app = express();
var fortune = require('./lib/fortune.js');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// 设置端口
app.set('port', process.env.PORT || 3300);
app.disable('x-powered-by');

// 设置静态目录
app.use(express.static(__dirname + '/public'));

// bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));






app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

// upload第一种用法
upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});
app.use('/upload', upload.fileHandler());

// // fileupload第二种用法

// app.use('/upload', function(req, res, next){
//     // console.log(111111111111);
//     upload.fileHandler({
//         uploadDir: function () {
//             return __dirname + '/public/uploads/'
//         },
//         uploadUrl: function () {
//             return '/uploads'
//         }
//     })(req, res, next);
// });

// app.use(function (req, res, next) {
//     res.locals.flash = res.session.flash;
//     delete req.session.flash;
//     next();
// });
// 日志
switch(app.get('env')){
    case 'development':
    app.use(require('morgan')('dev'));
    break;
    case 'production':
    app.use(require('express-logger')({
        path:__dirname+'log/requests.log'
    }));
    break;

    
}



// app.use(function (req, res, next) {
//     console.log('\n\nALLWAYS');
//     next();
// });

// app.get('/a', function (req, res) {
//     console.log('/a: 路由终止');
//     res.send('a');
// });
// app.get('/a', function (req, res) {
//     console.log('/a: 永远不会调用');
// });
// app.get('/b', function (req, res, next) {
//     console.log('/b: 路由未终止');
//     next();
// });
// app.use(function (req, res, next) {
//     console.log('SOMETIMES');
//     next();
// });
// app.get('/b', function (req, res, next) {
//     console.log('/b (part 2): 抛出错误');
//     throw new Error('b 失败');
// });

// app.use('/b', function (err, req, res, next) {
//     console.log('/b 检测到错误并传递');
//     next(err);
// });
// app.get('/c', function (err, req) {
//     console.log('/c: 抛出错误');
//     throw new Error('c 失败');
// });
// app.use('/c', function (err, req, res, next) {
//     console.log('/c: 检测到错误但不传递');
//     next();
// });

// app.use(function (err, req, res, next) {
//     console.log('检测到未处理的错误: ' + err.message);
//     res.send('500 - 服务器错误');
// });

// app.use(function (req, res) {
//     console.log('未处理的路由');
//     res.send('404 - 未找到');
// });

// app.listen(3000, function () {
//     console.log('监听端口3000');
// });





// app.use(function(req,res,next){
//    console.log('process request for " '+req.url+'"');
//    next();
// });

// app.use(function(req,res,next){
//      console.log('terminating request ');
//      res.send('thanks for playing'); 
// });
// app.use(function(){
//     console.log('whoops,i will never get called!');
// });

app.get('/', function (req, res) {
    // cookie
    req.session.userName = "anonymous";
    var colorScheme = req.session.colorScheme || "dark";
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom', { signed: true });
    console.log("monster:" + req.cookies.monster);
    console.log("signed_monster:" + req.signedCookies.signed_monster);
    res.render('home');
    // res.set('Content-Type', 'text/html');
    // var s = '';
    // for (var name in req.headers) {
    //     s += name + ':' + req.headers[name] + '\n';
    // }
    // res.send(s);

});
app.get('/cookietest', function (req, res) {
    // cookie
    console.log("monster:" + req.cookies.monster);
    console.log("signed_monster:" + req.cookies.signed_monster);

    res.render('cookietest');

});

app.get('/fileupload', function (req, res) {
    res.render('fileupload');
})

app.get('/newsletter', function (req, res) {
    var name = req.body.name || '', email = req.body.email || "";
    if (!email.match(VALID_EMAIL_REGEX)) {
        if (req.xhr) return res.json({ error: "invalid name email address" })
        req.session.flash = {
            type: 'danger',
            intro: 'validatioin error',
            message: 'the email address you entered was not valid.'
        };
        return res.redirect(303, 'newsletter/archive');
    }
    new NewsletterSignup({ name: name, email: email }).save(function (err) {
        if (err) {
            if (req.xhr) return res.json({ error: 'Database error.' });
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.',
            }
            return res.redirect(303, '/newsletter/archive');
        }
        if (req.xhr) return res.json({ success: true });
        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.',
        };
        return res.redirect(303, '/newsletter/archive');
    });
});




app.post('/process', function (req, res) {

    //  console.log('Form (from querystring):'+req.query.form);
    //  console.log('csrf token form hidden form fielf:'+req.body._csrf);
    //  console.log('Name (from visible form field):'+req.body.name);
    //  console.log('Email (from visible form field):'+req.body.email);
    // console.log(req.xhr);
    if (req.xhr || req.accepts('json,html') === 'json') {
        res.send({ success: true });
    } else {
        res.redirect(303, '/thank-you');
    };

});



app.get('/contest/vacation-photo', function (req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(), month: now.getMonth()
    });
});

app.post('/contest/vacation-photo/:year/:month', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});





app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function (req, res) {
    res.render('/tours/request-group-rate');
});

app.get('/headers', function (req, res) {
    res.type('html');
    var s = '';
    for (var name in req.headers) {
        s += '<div>' + name + ':' + req.headers[name] + '\n' + '</div>';
    }
    res.send(s);
});
app.get('/thank-you', function (req, res) {
    res.render('thank');
});


app.get('/error', function (req, res) {
    res.status(500).render('error');
});

app.get('/greeting', function (req, res) {
    res.render('about', {
        mesage: 'welcome',
        style: req.query.style,
        userid: req.session.userid,
        username: req.session.username
    });
});

// 没有布局视图渲染
app.get('/no-layout', function (req, res) {
    res.render('no-layout', { layout: null });
});

// 表单处理
app.post('/post-contact', function (req, res) {
    console.log('Received contact from' + req.body.name + '<' + req.body.email + '>');
    res.redirect(303, 'thank-you');
});

// 更强大的表单处理
app.post('/process-contact', function (req, res) {
    console.log('Received contact from ' + req.body.name + '<' + req.body.email + '>');
    try {
        //    保存到数据库
        return res.xhr ? res.render({ success: true }) : res.redirect(303, '/thank-you');
    } catch (ex) {
        return res.xhr ? res.json({ error: 'Database error.' }) :
            res.redirect(303, '/database-error');
    }
});

var tours = [{ id: 0, name: 'hood river', proce: 99.99 }];
app.get('/api/tours', function (req, res) {
    var products = [];
    var toursXml = '<xml version="1.0"?><tours>' + products.map(function (p) {
        return '<tour prict="' + p.price + '" id="' + p.id + '" >' + 'p.name' + '</tour>';
    }).join('') + '</tours>';

    var toursTxt = tours.map(function (p) {
        return p.id + ':' + p.name + '(' + p.price + ')';
    }).join('\n');
    res.format({
        'application/json': function () {
            res.json(tours);
        },
        'application/xml': function () {
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function () {
            res.type('text/xml');
            res.send(toursXml);
        },
        'text/plain': function () {
            res.type('text/plain');
            res.send(toursTxt);
        }
    });
});
app.get('/api/tour', function (req, res) {
    res.render('restapi');
});
app.post('/api/tour/:id', function (req, res) {
    console.log(req.params.id);
    var restxt = '';
    for (var k in req.session) {
        restxt += req.session[k] + '\n';
    }
    res.type('text');
    res.send(restxt);
    // res.json({session:req.session});
});

// API用于删除一个产品
app.delete('/api/tour/:id', function (req, res) {
    console.log(req.params.id);
    // var tour = [];
    // for (var i = tour.length - 1; i >= 0; i--) {
    //     if (tours[i].id == req.params.id) break;
    //     if (i >= 0) {
    //         tours.splice(i, 1);
    //         res.json({ success: true });
    //     } else {
    //         res.json({ error: 'no such tour exists.' })
    //     }
    // }
    res.json({ session: req.session });
});

app.use(function (req, res) {
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started in ' + app.get('env') + ' on http://localhost:' + app.get('port') + ':press ctrl +cc to terminate');
});



