const utf8 = require('utf8');
const SSHClient = require('ssh2').Client;

module.exports = CreateTerminal = (machineConfig, socket, io) => {
  const ssh = new SSHClient();
  let { roomId, ip, username, password } = machineConfig;
  ssh.on('ready', () => {
    io.sockets.in(roomId).emit(roomId, '\r\n***' + ip + ' SSH CONNECTION ESTABLISHED ***\r\n');
    ssh.shell((err, stream) => {
      if (err) {
        return io.sockets.in(roomId).emit(roomId, '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
      }
      socket.on(roomId, data => {
        stream.write(data);
      });
      stream.on('data', d => {
        io.sockets.in(roomId).emit(roomId, utf8.decode(d.toString('binary')));
      }).on('close', () => {
        ssh.end();
      });
    })
  }).on('close', () => {
    io.sockets.in(roomId).emit(roomId, '\r\n*** SSH CONNECTION CLOSED ***\r\n');
  }).on('error', err => {
    console.log(err);
    io.sockets.in(roomId).emit(roomId, '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
  }).connect({
    host: ip,
    port: 22,
    username: username,
    password: password
  });
}