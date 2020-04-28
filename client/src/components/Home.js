import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SplitPane, { Pane } from 'react-split-pane';
import Editor from './Editor';
import ChatVideo from './ChatVideo';
import ChatText from './ChatText';
import ButtonCopyToClipboard from './ButtonCopyToClipboard';
import Panel from './Panel';

const Home = ({ connection }) => {
  return (
    <Fragment>
      {connection.socket ?
        <div className="content">
          <Editor />
          <div className="chat">
            {connection.isHost ?
              <ButtonCopyToClipboard
                tooltip="Copy Invitation Link"
                buttonText="Invitation Link"
                textToCopy={`${window.location.origin}/login/${connection.roomId}`}
              />
              : null
            }
            <Panel />
            {/* <ChatVideo /> */}
            {/* <ChatText /> */}
          </div>
        </div>
        : null}
    </Fragment>
  );
}

const mapStateToProps = state => ({
  connection: state.connection,
});

export default connect(mapStateToProps, null)(Home);