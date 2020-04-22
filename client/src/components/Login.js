import React from 'react';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import io from "socket.io-client";
import { Input } from 'antd';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import GLOBAL from '../global';

const { confirm } = Modal;

const Login = ({ connection, setConnection, ...props }) => {
  const { session } = useParams();

  const handleEnter = e => {
    const userName = e.target.value;

    if (connection.socket === undefined) {
      const socket = io.connect(GLOBAL.server);

      socket.on('userId', (userId) => {
        const hosts = {
          userIdLocal: userId,
          userIdRemote: session,
        }

        setConnection({
          socket,
          userNameLocal: userName,
          userIdLocal: hosts.userIdLocal,
        });

        if (session !== undefined) {
          socket.emit('validate_host', hosts);
          socket.on('validate_host', valid => {
            if (!valid) {
              props.history.push("/invalid");
            } else {
              socket.emit('request_join', hosts, userName);
            }
          });
        } else {
          props.history.push("/home");
        }

        socket.on('request_join', (hosts, userName) => {
          showConfirm(hosts, userName);
        });

        socket.on('response_join', (hosts, response) => {
          if (response) {
            console.log(hosts.userNameRemote);
            setConnection({
              socket,
              userNameLocal: userName,
              userNameRemote: hosts.userNameRemote,
              userIdLocal: hosts.userIdLocal,
              userIdRemote: hosts.userIdRemote,
              isHost: false
            });
            props.history.push("/home");
          } else {
            props.history.push("/rejected");
          }
        });

        const showConfirm = (hosts, tmpUserName) => {
          confirm({
            title: 'Joining request',
            icon: <ExclamationCircleOutlined />,
            content: `${tmpUserName} request to join.`,
            onOk() {
              setConnection({
                socket,
                userNameLocal: userName,
                userNameRemote: tmpUserName,
                userIdLocal: hosts.userIdRemote,
                userIdRemote: hosts.userIdLocal,
                isHost: true
              });

              hosts.userNameRemote = userName;
              socket.emit('response_join', hosts, true);
            },
            onCancel() {
              socket.emit('response_join', hosts, false);
            },
          });
        }
      });
    }
  }

  return (
    <div className="login-content">
      <div className="login">
        <h2>Your Name</h2>
        <Input
          enterButton={true}
          onPressEnter={handleEnter}
          placeholder="Type here..."
        />
      </div>
    </div>
  )
};

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

export default connect(mapStateToProps, mapDispatchToTops)(withRouter(Login));