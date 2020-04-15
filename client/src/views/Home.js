import React, { Fragment, useEffect } from 'react';
import io from "socket.io-client";
import { connect } from 'react-redux';
import GLOBAL from '../global';
import Editor from '../components/Editor';
import ChatVideo from '../components/ChatVideo';

const Home = ({ connection, setConnection }) => {
  useEffect(() => {
    if (connection.socket === null) {
      const socket = io.connect(GLOBAL.server);

      socket.on("userId", (id) => {
        setConnection({
          ...connection,
          socket,
          userId: id
        });
      });
    }
  }, []);

  return (
    <Fragment>
      {connection.socket ?
        <div className="content">
          <Editor />
          {/* <ChatVideo /> */}
        </div>
        : null}
    </Fragment>
  );
}

const mapStateToProps = state => ({
  connection: state.connection
});

const mapDispatchToTops = dispatch => ({
  setConnection(connection) {
    dispatch({
      type: 'CONNECTION',
      connection
    })
  }
});

export default connect(mapStateToProps, mapDispatchToTops)(Home);