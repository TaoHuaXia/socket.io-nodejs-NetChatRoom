/**
 * Created by wangyihua on 2016/6/14.
 */
var http = require('http');
http.createServer(function (request,response) {
    var message = request.on('end',function () {
        
    });
    response.writeHead(200,{'Content-Type':'text-plain'});
    response.end(message);
}).listen(8124);