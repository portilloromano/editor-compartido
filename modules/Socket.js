const socket = require('socket.io');
const CreateTerminal = require('./CreateTerminal');

module.exports = Socket = (server) => {
  const io = socket(server);

  let users = {};
  let roomsUsers = [];

  io.on('connection', socket => {
    users[socket.id] = {};

    socket.emit('userId', socket.id);

    socket.on('add_user', user => {
      users[socket.id].userName = socket.userName = user.userName;
      users[socket.id].roomId = socket.roomId = user.roomId;

      socket.join(socket.roomId);

      if (roomsUsers[socket.roomId] === undefined) roomsUsers[socket.roomId] = [];
      roomsUsers[socket.roomId].push({ userId: socket.id, userName: socket.userName });

      io.sockets.in(socket.roomId).emit('user_join', roomsUsers[socket.roomId], socket.userName);
    });

    socket.on('validate_room', roomId => {
      let search = io.sockets.adapter.rooms[roomId];
      let exist = search !== undefined ? true : false;

      socket.emit('validate_room', exist);
    });

    socket.on('request_join', ({ userId, userName, roomId } = user) => {
      socket.broadcast.to(roomId).emit('request_join', { userId, userName });
    });

    socket.on('response_join', (userId, response) => {
      socket.to(userId).emit('response_join', response);
    })

    socket.on('disconnect', () => {
      if (roomsUsers[socket.roomId] !== undefined) {
        roomsUsers[socket.roomId] = roomsUsers[socket.roomId].filter(user => user.userId !== socket.id);
        socket.leave(socket.roomId);
        socket.broadcast.to(socket.roomId).emit('user_left', roomsUsers[socket.roomId], socket.userName);
      }
    });

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
      socket.broadcast.to(socket.roomId).emit('selection', data);
    })

    socket.on('filedata', (data, language) => {
      socket.broadcast.to(socket.roomId).emit('resetdata', data, language);
    })

    socket.on('key', data => {
      socket.broadcast.to(socket.roomId).emit('key', data);
    })

    socket.on('change_language', language => {
      socket.broadcast.to(socket.roomId).emit('change_language', language);
    })

    ///// Chat Text /////

    socket.on('new_message', data => {
      socket.broadcast.to(socket.roomId).emit('new_message', data);
    });

    socket.on('typing', userIdRemote => {
      socket.broadcast.to(socket.roomId).emit('typing', { userName: socket.userName });
    });

    socket.on('typing_stop', userIdRemote => {
      socket.broadcast.to(socket.roomId).emit('typing_stop', { userName: socket.userName });
    });

    ///// Terminal /////

    socket.on('create_terminal', () => {
      CreateTerminal({
        roomId: socket.roomId,
        ip: '127.0.0.1',
        username: '',
        password: ''
      }, socket, io);
    });
  });
}