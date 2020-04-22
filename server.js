const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
// const server = https.createServer({
//   key: fs.readFileSync('./key.pem'),
//   cert: fs.readFileSync('./cert.pem'),
//   passphrase: 'geekshubs'
// }, app)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const io = socket(server);

io.on('connection', socket => {
  socket.emit('userId', socket.id);

  socket.on('validate_host', hosts => {
    io.clients((error, clients) => {
      if (error) throw error;
      socket.emit('validate_host', clients.includes(hosts.userIdRemote));
    });
  });

  socket.on('request_join', (hosts, userName) => {
    socket.to(hosts.userIdRemote).emit('request_join', hosts, userName);
  });

  socket.on('response_join', (hosts, response) => {
    socket.to(hosts.userIdLocal).emit('response_join', hosts, response);
  })

  socket.on('disconnect', () => {

  })

  ///// Chat Video /////

  socket.on('call_user', data => {
    console.log('data.userToCall', data.userToCall);
    console.log('data.from', data.from);
    io.to(data.userToCall).emit('call_incoming', { signal: data.signalData, from: data.from });
  })

  socket.on('call_accept', data => {
    io.to(data.to).emit('call_accept', data.signal);
  })

  ///// Editor /////

  socket.on('selection', data => {
    data.color = socket.color
    data.user = socket.user
    socket.to(data.userIdRemote).emit('selection', data);
  })

  socket.on('filedata', data => {   //File Data Event
    socket.broadcast.emit('resetdata', data)    //Give File Data
  })

  socket.on('key', data => {
    socket.to(data.userIdRemote).emit('key', data)
  })

  ///// Chat Text /////

  socket.on('new_message', data => {
    socket.to(data.userIdRemote).emit('new_message', data);
  });

  socket.on('typing', userIdRemote => {
    socket.to(userIdRemote).emit('typing');
  });

  socket.on('typing_stop', userIdRemote => {
    socket.to(userIdRemote).emit('typing_stop');
  });
});

server.listen(8000, () => console.log('server is running on port 8000'));