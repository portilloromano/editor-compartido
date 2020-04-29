import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit';

const Xterminal = ({ connection }) => {
  const { socket, userId, userName, roomId, isHost } = connection;

  const term = new Terminal({ cursorBlink: true });
  const fitAddon = new FitAddon();

  useEffect(() => {
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));
    fitAddon.fit();

    if (isHost) socket.emit('create_terminal');
  }, []);

  if (isHost) {
    term.onData(data => {
      socket.emit(roomId, data);
    });
  }

  socket.on(roomId, data => {
    term.write(data);
  });

  return (
    <div className="terminal">
      <div id="terminal"></div>
    </div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection,
});

export default connect(mapStateToProps, null)(Xterminal);