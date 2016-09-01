/**
 * Created by wangyihua on 2016/7/19.
 */
var sql = require("mysql"),
    connection = sql.createConnection({
        host:"localhost",
        user:"root",
        password:"123456",
        database:"netchat"
    });
var name ='王艺桦';
var query = "select username as uname,password as pwd from user where username='"+name+"'";
console.log(query);
connection.connect(function (err) {
    if(err){
        console.log(+err.message);
    }else{
        console.log("mysql successfully connected!");
    }
});
connection.query("select username as uname from user where username='"+name+"'",function (err,rows) {
    if(err){
        console.log("查询出错"+err.message);
    }else if(rows.length != 0){
        console.log(rows);
    }else {
        console.log("无结果！");
    }
});
connection.end();