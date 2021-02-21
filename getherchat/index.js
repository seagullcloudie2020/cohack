const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('name', (name) => {
    console.log(name + ' has entered the chat');
    socket.broadcast.emit('name', name);
    socket.on('disconnect', () => {
      console.log(name + ' has left the chat');
      socket.broadcast.emit('leave message', name + ' has left the chat')
    });
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('(global) ' + msg);
    socket.broadcast.emit('chat message', msg);
  });
  socket.on('cafeteria message', (msg) => {
    console.log('(cafeteria) ' + msg);
    socket.broadcast.emit('cafeteria message', msg);
  });
  socket.on('lobby message', (msg) => {
    console.log('(lobby) ' + msg);
    socket.broadcast.emit('lobby message', msg);
  });
  socket.on('leave message', (name) => {
    socket.broadcast.emit('leave message', name);
  });
  socket.on('cafeteria notification', (message) => {
    console.log(message);
    socket.broadcast.emit('cafeteria message', message);
  });
  socket.on('lobby notification', (message) => {
    console.log(message);
    socket.broadcast.emit('lobby message', message);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
