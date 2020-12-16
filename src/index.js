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

  log("[Authenticate] Map key: " + key + ", value: " + value);

  map[key] = value;
  socket.user = key;

  next();
});

io.on('connection', (socket) => {
  log("[Client connect] socket.user : " +  socket.user);
  log("[Client connect] socket.id   : " +  socket.id);
  log("[Client connect] socket.handshake.headers.host       : " + socket.handshake.headers.host);
  log("[Client connect] socket.handshake.headers.connection : " + socket.handshake.headers.connection);
  log("[Client connect] socket.handshake.address                    : " +  socket.handshake.address);
  log("[Client connect] socket.request.connection.remoteAddress     : " +  socket.request.connection.remoteAddress);
  log("[Client connect] socket.request.connection._peername.address : " +  socket.request.connection._peername.address);
  socket.on('chat message', (msg) => {
    log("[Client chat message] socket.user : " +  socket.user);
    const chat = toJapanDateString() + " [IP]" + map[socket.user] + ": " + msg;
    log("[Client chat message] : " +  chat);
    io.emit('chat message', chat);
  });
  socket.on('set username', (username) => {
    socket.username = username;
  });
  socket.on("disconnect", (reason) => {
    log("[Client disconnect] socket.user : " +  socket.user);
    map.delete[socket.user];
  });
});

function toJapanDateString() {
  const date = new Date();
  date.setTime(date.getTime() + 1000 * 60 * 60 * 9);
  return date.toLocaleString();
}

http.listen(3000, () => {
  log('listening on *:3000');
});

function log(message) {
  console.log(toJapanDateString() + " " + message);
  
}