 

insert into mysql.user(Host,User,Password) values("192.168.31.218","lx",password("lx"));

update mysql.user set authentication_string=password('lx') where user='lx';

打开 mysql

/etc/init.d/mysql start/stop


查看数据库的情况
select Host,User from mysql.user;

创建远程用户

create user lx identified by "lx";

 分配权限
 grant all privileges on *.* to 'lx'@'%'identified by 'lx' with grant option; 

刷新权限相关

flush privileges;

重启mysql

service mysql restart

开机空白
