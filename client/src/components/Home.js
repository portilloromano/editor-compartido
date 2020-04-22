import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import ChatVideo from './ChatVideo';
import ChatText from './ChatText';
import ButtonCopyToClipboard from './ButtonCopyToClipboard';

const Home = ({ connection }) => (
  <Fragment>
    {connection.socket ?
      <div className="content">
        <Editor />
        <div className="chat">
          <ButtonCopyToClipboard
            tooltip="Copy Invitation Link"
            buttonText="Invitation Link"
            textToCopy={`${window.location.origin}/login/${connection.userIdLocal}`}
          />
          {/* <ChatVideo /> */}
          <ChatText />
        </div>
      </div>
      : null}
  </Fragment>
);

const mapStateToProps = state => ({
  connection: state.connection,
});

export default connect(mapStateToProps, null)(Home);