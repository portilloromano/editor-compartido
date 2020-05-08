import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import DirTree from './DirTree';
import Editor from './Editor';
import Xterminal from './Xterminal';
import ButtonCopyToClipboard from './ButtonCopyToClipboard';
import Panel from './Panel';
import Footer from './Footer';

const Home = ({ connection, setResize, resize }) => {
  return (
    <Fragment>
      {connection.socket ?
        <div className="content">
          <div className="wrapper">
            <SplitPane
              split="vertical"
              defaultSize={"70%"}
            >
              <DirTree />
              <SplitPane
                split="horizontal"
                defaultSize={"70%"}
              >
                <Editor />
                <Xterminal />
              </SplitPane>
              <div>
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
                </div>
              </div>
            </SplitPane>
          </div>
          <Footer />
        </div >
        : null}
    </Fragment >
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

export default connect(mapStateToProps, mapDispatchToTops)(Home);