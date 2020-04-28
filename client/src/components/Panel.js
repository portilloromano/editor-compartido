import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs, Badge } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import ChatText from './ChatText';

const { TabPane } = Tabs;

const Panel = ({ connection }) => {
  const { socket } = connection;

  const [list, setList] = useState({
    number: 0,
    users: []
  })

  socket.on('user_join', (users, userName) => {
    setList({
      number: users.length,
      users
    });
  });

  socket.on('user_left', (users, userName) => {
    setList({
      number: users.length,
      users
    });
  });

  function callback(key) {
    console.log(key);
  }

  return (
    <div>
      <Tabs onChange={callback} type="card">
        <TabPane
          key="1"
          tab={
            <span>
              <MessageOutlined />
            </span>
          }
        >
          <ChatText />
        </TabPane>
        <TabPane
          key="2"
          tab={
            <span>
              <UserOutlined />
              <Badge count={list.number} />
            </span>
          }
        >
          <ul>
            {list.users.map((user, index) =>
              <li key={index}>{user.userName}</li>)}
          </ul>
        </TabPane>

      </Tabs>
    </div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection,
});

export default connect(mapStateToProps, null)(Panel);