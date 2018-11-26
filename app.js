var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(8080);
// WARNING: app.listen(80) will NOT work here!

app.use(express.static(__dirname));


// redis;
let Gsocket = {

};

io.on('connection', function (socket) {
    // Gsocket = socket;
    console.log(socket.id);
  socket.on('login',function(data){
    // console.log(data);
    io.broadcast.emit("public","hahahaahah");
  })
});

app.get("/update",(req,res)=>{
    setTimeout(()=>{
        Gsocket.emit("updata","updata");
    })
})