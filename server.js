const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socket = require('socket.io');

const app = express();
// const server = http.createServer(app);
const server = https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'geekshubs'
}, app)

const io = socket(server);

const users = {};

io.on('connection', socket => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit('userId', socket.id);

  socket.broadcast.emit('allUsers', users);

  socket.on('disconnect', () => {
    delete users[socket.id];
  })

  socket.on('callUser', data => {
    console.log('callUser', data);
    io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
  })

  socket.on('acceptCall', data => {
    console.log('acceptCall', data);
    io.to(data.to).emit('callAccepted', data.signal);
  })

  socket.on('editor', data => {
    console.log(data);
    socket.broadcast.emit('edit', data);
  })
});

server.listen(8000, () => console.log('server is running on port 8000'));