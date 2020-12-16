var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("Client connection. socket.id: " +  socket.id);
  console.log("Client connection. socket.handshake.address: " +  socket.handshake.address);
  console.log("Client connection. socket.request.connection.remoteAddress: " +  socket.request.connection.remoteAddress);
  console.log("Client connection. socket.request.connection._peername.address: " +  socket.request.connection._peername.address);
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});