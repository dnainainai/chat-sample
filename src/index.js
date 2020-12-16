const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 簡易的な情報でユーザーを特定しておく
let map = new Map();

function getKey(socket) {
  return socket.request.headers.host + "," + socket.handshake.address + "," + socket.id;
}

// authenticate
io.use(async (socket, next) => {
  
  const key = getKey(socket);
  const value = socket.handshake.address;

  console.log("[Authenticate] Map key: " + key + ", value: " + value);

  map[key] = value;
  socket.user = key;

  next();
});

io.on('connection', (socket) => {
  console.log("[Client connect] socket.user : " +  socket.user);
  console.log("[Client connect] socket.id   : " +  socket.id);
  console.log("[Client connect] socket.handshake.headers.host       : " + socket.handshake.headers.host);
  console.log("[Client connect] socket.handshake.headers.connection : " + socket.handshake.headers.connection);
  console.log("[Client connect] socket.handshake.address                    : " +  socket.handshake.address);
  console.log("[Client connect] socket.request.connection.remoteAddress     : " +  socket.request.connection.remoteAddress);
  console.log("[Client connect] socket.request.connection._peername.address : " +  socket.request.connection._peername.address);
  socket.on('chat message', (msg) => {
    console.log("[Client chat message] socket.user : " +  socket.user);
    io.emit('chat message', "[IP]" + map[socket.user] + ": " + msg);
  });
  socket.on('set username', (username) => {
    socket.username = username;
  });
  socket.on("disconnect", (reason) => {
    console.log("[Client disconnect] socket.user : " +  socket.user);
    map.delete[socket.user];
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});