import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Peer from "simple-peer";

const ChatVideo = ({ connection }) => {
  const { socket, userName, userIdLocal, userIdRemote, isHost } = connection;

  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (userVideo) {
          userVideo.current.srcObject = stream;
        }
      })
  }, []);

  useEffect(() => {
    console.log('userIdRemote', userIdRemote);
    console.log('isHost', isHost);
    if (userIdRemote !== undefined && !isHost) {
      console.log('entro');
      callPeer(userIdRemote)
    }
  }, [isHost]);

  const callPeer = id => {
    console.log('call_peer', id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      console.log('signal', data);
      socket.emit("call_user", { userToCall: userIdRemote, signalData: data, from: userIdLocal })
    })

    peer.on("stream", stream => {
      console.log('stream');
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("call_accept", signal => {
      console.log('call_accept');
      setCallAccepted(true);
      peer.signal(signal);
    })
  }

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      console.log('signal');
      socket.emit("call_accept", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      console.log('stream');
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  socket.on("call_incoming", (data) => {
    console.log('call_incoming Out');
    if (isHost) {
      console.log('call_incoming', data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);

      // acceptCall();
    }
  })

  return (
    <div className="video-chat">
      {stream ?
        <video className="video-user" playsInline muted ref={userVideo} autoPlay /> :
        null
      }

      {callAccepted ?
        <video className="video-partner" playsInline ref={partnerVideo} autoPlay /> :
        null
      }

      <div>
        {receivingCall ?
          <div>
            <h1>{caller} is calling you</h1>
            <button onClick={acceptCall}>Accept</button>
          </div> :
          null
        }
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  connection: state.connection
});

export default connect(mapStateToProps)(ChatVideo);