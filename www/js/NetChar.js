/**
 * Created by wangyihua on 2016/6/14.
 */
$(function () {
    var name ,   //存储此次登录用户的用户名
        socket = io(); //创建一个socket实例
        

    //设置窗口自适应高度
   $(window).load(function () {
       $("body").height($(window).height()+'px');
   }).resize(function () {
       $("body").height($(window).height()+'px');
   });

    //发送请求
    //登陆设置
    $("#login_btn").click(function () {
        //登录名验证
        name = $("#username").val();
        var reg = /[a-zA-z0-9\u4e00-\u9fa5]+/;
        if(reg.test(name)){
            socket.emit('check',name);
        }else {
            alert("用户名错误！");
        }
    });
    //发送信息事件
    //点击发送
    $("#send").click(function () {
        var message = $("#key_text").val();
        //发送message事件 随事件绑定用户输入的信息
        socket.emit('message',{name:name,message:message});
        //发送之后清空输入框
        $("#key_text").val('');
    });
    //回车发送
    $(document).keydown(function (e) {
        if(e.keyCode == 13){
            var message = $("#key_text").val();
            socket.emit('message',{name:name,message:message});
            $("#key_text").val('');
        }
    });
    //登陆验证
    socket.on('checkResult',function (msg) {
       if (msg.name == name){
           if(msg.result){
               $(".login").fadeOut(800,function () {
                   socket.emit('login',name);
               })
           }else {
               alert("不存在此用户名！");
           }
       }
    });
    //接受应答
    socket.on('message',function (msg) {
        //获取接受信息时的时间
        var time = new Date();
        var pTime = time.toLocaleString();
        //如果是自己发送的信息
        if(msg.name == name) {
            //添加信息框 并放到右边
            $(".chatBar").append("<div class='pull-right myMes'>" +
                "<p class='time'><strong class='name'>我</strong>" + pTime + "</p>" +
                "<p class='text'>" + msg.message + "</p>" +
                "</div>");
        }else {
            //如果是他人发的信息 放在左边
            $(".chatBar").append("<div class='pull-left otherMes'>" +
                "<p class='time'><strong class='name'>"+msg.name+"</strong>" + pTime + "</p>" +
                "<p class='text'>" + msg.message + "</p>" +
                "</div>");
        }
    });
    //接受登陆事件
    socket.on('login',function (msg) {
        //提示用户登陆
        $(".chatBar").append("<div class='login_info'>---"+msg.message+"加入聊天室---</div>");
        //重新刷新用户列表
        $(".clientBar_list").empty();
        for(var i =0; i<msg.list.length; i++){
            $(".clientBar_list").append("<li><span>"+msg.list[i]+"</span></li>");
        }
        
    });
    //接受离开登陆室事件
    socket.on('discount',function (msg) {
        //在线用户列表删掉相应的用户
        $(".clientBar_list li:eq("+msg.id+")").remove();
        //提示用户离开登陆室
        $(".chatBar").append("<div class='login_info'>---"+msg.name+"离开聊天室---</div>");
    });


});