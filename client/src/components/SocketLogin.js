import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import io from "socket.io-client";
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import GLOBAL from '../global';

const { confirm } = Modal;

const SocketLogin = ({ connection, setConnection, isHost, userName, roomId, ...props }) => {
  if (connection.socket === undefined) {
    const socket = io.connect(GLOBAL.server);

    socket.on('userId', userId => {
      setConnection({
        socket,
        userId,
        userName,
        roomId,
        isHost
      });

      socket.on('user_join', (users, userName) => {
        message.info(`${userName} joined.`);
      });

      socket.on('user_left', (users, userName) => {
        message.warning(`${userName} leaved.`);
      });

      if (isHost === false) {
        socket.emit('validate_room', roomId);
        socket.on('validate_room', valid => {
          if (!valid) {
            props.history.push("/invalid");
          } else {
            socket.emit('request_join', { userId, userName, roomId });
          }
        });
      } else {
        socket.emit('add_user', { userName, roomId });

        props.history.push("/home");
      }

      socket.on('request_join', user => {
        if (isHost) showConfirm(user);
      });

      socket.on('response_join', (response) => {
        if (response) {
          socket.emit('add_user', { userName, roomId });

          props.history.push("/home");
        } else {
          props.history.push("/rejected");
        }
      });

      const showConfirm = user => {
        confirm({
          title: 'Joining request',
          icon: <ExclamationCircleOutlined />,
          content: `${user.userName} request to join.`,
          onOk() {
            socket.emit('response_join', user.userId, true);
          },
          onCancel() {
            socket.emit('response_join', user.userId, false);
          },
        });
      }
    });
  }

  return (<Fragment />);
}

const mapStateToProps = state => ({
  connection: state.connection,
});

const mapDispatchToTops = dispatch => ({
  setConnection(connection) {
    dispatch({
      type: 'CONNECTION',
      connection
    })
  }
});

export default connect(mapStateToProps, mapDispatchToTops)(withRouter(SocketLogin));