import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';

const ChatText = ({ connection }) => {
  const { socket, userName } = connection;

  const [typingMessage, setTypingMessage] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  let typing = false;
  let lastTypingTime;

  useEffect(() => {
    const objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);

  useEffect(() => {
    updateTyping();
  }, [message]);

  const addZero = number => {
    if (number < 10) {
      number = '0' + number
    }
    return number;
  }

  const sendMessage = () => {
    if (message.trim() !== '') {
      const time = new Date();
      const timeFormat = `${addZero(time.getHours())}:${addZero(time.getMinutes())}`;

      const addUsernameTime = {
        message,
        userName,
        time: timeFormat
      }

      setMessage(addUsernameTime);

      addChatMessage(addUsernameTime, 'blue');
      socket.emit('new_message', addUsernameTime);
      setMessage('');
    }
  }

  const addChatMessage = (data, color) => {
    setMessages([
      ...messages,
      {
        ...data,
        classColor: color
      }
    ]);
  }

  const updateTyping = () => {
    if (!typing) {
      typing = true;
      socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();

    setTimeout(() => {
      let typingTimer = (new Date()).getTime();
      let timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= 2000 && typing) {
        socket.emit('typing_stop');
        typing = false;
      }
    }, 2000);
  }

  socket.on('new_message', (data) => {
    addChatMessage(data, 'red');
  });

  socket.on('typing', (data) => {
    setTypingMessage(`${data.userName} is typing...`);
  });

  socket.on('typing_stop', (data) => {
    setTypingMessage('');
  });

  return (
    <div className="chat-content">
      <div id="messages">
        <ul>
          {messages.map((item, index) =>
            <li key={index}>
              <div id="username-time">
                <span id="username" className={item.classColor}>{item.userName}</span>
                <span id="time">{item.time}</span>
              </div>
              <span id="message">{item.message}</span>
            </li>)}
        </ul>
      </div>
      <span id="typing">{typingMessage}</span>
      <Input
        enterButton={true}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onPressEnter={sendMessage}
        placeholder="Type here..."
      />
    </div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection
});

export default connect(mapStateToProps)(ChatText);