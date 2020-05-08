import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit';

const Xterminal = ({ connection, resize, setResize }) => {
  const { socket, roomId, isHost } = connection;

  const term = new Terminal({ cursorBlink: true });
  const fitAddon = new FitAddon();

  useEffect(() => {
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));
    fitAddon.fit();

    if (isHost) socket.emit('create_terminal');
  }, []);

  useEffect(() => {
    fitAddon.fit();
    console.log('fitAddon');
    setResize({
      ...resize,
      xterm: false
    });
  }, [resize.xterm]);

  if (isHost) {
    term.onData(data => {
      socket.emit(roomId, data);
    });
  }

  socket.on(roomId, data => {
    term.write(data);
  });

  return (
    <div id="terminal"></div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection,
  resize: state.resize,
});

const mapDispatchToTops = dispatch => ({
  setResize(resize) {
    dispatch({
      type: 'RESIZE',
      resize
    })
  }
});

export default connect(mapStateToProps, mapDispatchToTops)(Xterminal);