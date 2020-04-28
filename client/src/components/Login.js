import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import shortid from 'shortid';
import { Input } from 'antd';
import SocketLogin from './SocketLogin';

const Login = ({ connection, setConnection, ...props }) => {
  const { room } = useParams();

  const [state, setState] = useState({
    isHost: room === undefined ? true : false,
    userName: '',
    roomId: room === undefined ? shortid.generate() : room,
    show: false
  });

  const handleEnter = e => {
    setState({
      ...state,
      userName: e.target.value,
      show: true
    });
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
      {state.show ?
        <SocketLogin
          isHost={state.isHost}
          userName={state.userName}
          roomId={state.roomId}
        /> : null}
    </div>
  )
};

export default Login;