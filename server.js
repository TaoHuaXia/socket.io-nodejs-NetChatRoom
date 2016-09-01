/**
 * Created by wangyihua on 2016/6/14.
 */
var express = require('express'),
    app =  express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    sql = require("mysql"),
    connection = sql.createConnection({
       host:"localhost",
       user:"root",
       password:"123456",
       database:"netchat"
    });

connection.connect(function (err) {
   if(err){
      console.log(err.message);
   }else {
      console.log("Mysql successfully connected!");
   }
});

app.use('/',express.static(__dirname+'/www'));

var user = [];
//绑定连接事件
io.on('connection',function (socket) {             //外面用io
   console.log("user connect!");
   
   //建立连接后绑定事件：
   //登陆用户名验证
   socket.on('check',function (msg) {
      //查询用户名
      connection.query("select username as uname from user where username='"+msg+"'",function (err,rows) {
         if(err){
            console.log("查询出错"+err.message);
         }else if(rows.length != 0){
            io.emit('checkResult',{name:msg,result:true});
         }else {
            io.emit('checkResult',{name:msg,result:false});
         }
      });
   });
   //登陆事件
   socket.on('login',function (msg) {     //里面绑定事件用socket
      console.log("login:"+msg);
      user.push(msg);
      socket.username= msg;
      socket.userId = user.length-1;
      io.emit('login',{message:msg,list:user});
   });
   //发送信息事件
   socket.on('message',function (msg) {     //里面绑定事件用socket
      console.log("message:"+msg.message);
      io.emit('message',msg);
   });
   //取消链接事件
   socket.on('disconnect',function () {
      user.splice(socket.userId,1);
      io.emit('discount',{name:socket.username,id:socket.userId});
      console.log("u are disconnect!");
   });
});
//监听端口
http.listen(3000,function () {
   console.log("Server successfully start!Lisen on port 3000! ");
});
