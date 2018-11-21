var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app)
var io = require('socket.io')(server);

server.listen("8000", function() {
  console.log('Express server listening on port ' + 8000);
});
// 监听socket连接
io.on('connection', function (socket) {
    // 当某用户连上聊天室socket服务时，给他打个招呼
    sendToSingle(socket, {
        event: 'greet_from_server',
        data: `你好${socket.id}`
    })
    // 对其他用户给出通知：某某某加入了聊天室
    broadcastExceptSelf(socket, {
        event: 'new_user_join',
        data: {
            user: socket.id
        }
    })
    // 监听用户发的聊天内容
    socket.on('chat', function (data) {
        // 然后广播给其他用户：某某某说了什么
        broadcastExceptSelf(socket, {
            event: 'new_chat_content',
            data: {
                user: socket.id,
                content: data
            }
        })
    });
    // 监听socket连接断开
    socket.on('disconnect', (reason) => {
        // 广播给其他用户：某某某退出了聊天室
        broadcastExceptSelf(socket, {
            event: 'someone_exit',
            data: {
                user: socket.id
            }
        })
    });
});
// 给当前socket连接单独发消息
function sendToSingle(socket, param) {
    socket.emit('singleMsg', param);
}
// 对所有socket连接发消息
function broadcastAll(param) {
    io.emit('broadcastAll', param)
}
// 对除当前socket连接的其他所有socket连接发消息
function broadcastExceptSelf(socket, param) {
    socket.broadcast.emit('broadcast', param);
}