var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(9000);


io.sockets.on('connection', function (socket) {
  //Send welcome after connection is established
  socket.emit('welcome', { hello: 'world' });

  //Response question from client include client name
  socket.on('howareyou', function (data) {
    socket.emit('howareyou', { data: 'I\'m fine, thank' + data.name });
  });

  socket.on('disconnect', function () {
    console.log("Client is disconnected");
  });
});