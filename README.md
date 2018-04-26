# node-express-demo

使用命令 在生产模式下运行。
NODE_ENV=production node index.js

# 14 路由
## 子域名
express 默认的路由不把子域名考虑在内
通过vhost 设置子域名

npm install --save vhost

var admin = express.Router();
app.use(vhost('admin.*',admin));
admin.get('/',function(req,res){
    res.render(admin/home);
});
admin.get('/users',function(){
    res.render('admin/users')    
});

子路的实质是创建一个新的express子路由的实例，
## 路由中间件
app.get('/',function(req,res,next){
   if(Math.random()<0.5){
       return next();
   } 
       res.send()
   
});

app.get('/',function(req,res){
   res.send('and somtimes that');
});
路由中间件的作用，注入特定的函数，用来做授权验证。

function specials(req,res,next){
    res.locals.specials=getSpecialsFormDatabase();
    next();
}
app.get('/page-with-specials',specials,function(){
    res.render('page-with-specials');
});

用作授权
function authorize (req,res,next){
    if(req.session.authorized) return next();
}
app.get('/secret',authorize,function(){
    res.render('secret');
});
app.get('/sub-rsa',function(){
   res.render('sub-rosa');
});

## 路由正则

app.get('/user(name)?',function(){
      res.render('user');
});

app.get(/crazy|mad(ness)?|lunacy/function(req,res){
     
});

