var express = require('express');
var bodyParser = require('body-parser');

// 设置视图引擎
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main' });
var app = express();
var fortune = require('./lib/fortune.js');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// 设置端口
app.set('port', process.env.PORT || 3300);
app.disable('x-powered-by');

// 设置静态目录
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/', function (req, res) {

    res.render('home');
    // res.set('Content-Type', 'text/html');
    // var s = '';
    // for (var name in req.headers) {
    //     s += name + ':' + req.headers[name] + '\n';
    // }
    // res.send(s);

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
    var restxt='';
    for(var k in req.session){
        restxt +=req.session[k]+'\n';
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
    res.json({session:req.session});
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
    console.log('Express started in '+ app.get('env')+' on http://localhost:' + app.get('port') + ':press ctrl +cc to terminate');
});



