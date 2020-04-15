import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Peer from "simple-peer";

const ChatVideo = ({ connection }) => {
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();

  const params = useParams();
  const { socket, userId } = connection;

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (userVideo) {
          userVideo.current.srcObject = stream;
        }
      })

    socket.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })

    if (params.session !== undefined) {
      console.log('useParams', params.session);
      callPeer(params.session)
    }
  }, []);

  const callPeer = id => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: userId })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", signal => {
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
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  return (
    <div>
      {stream ?
        <video className="video-user" playsInline muted ref={userVideo} autoPlay /> :
        null
      }

      <h3>Session Key: {userId}</h3>

      {callAccepted ?
        <video className="video-partner" playsInline ref={partnerVideo} autoPlay /> :
        null
      }

      <div>
        {Object.keys(users).map(key => {
          if (key === userId) {
            return null;
          }
          return (
            <button key={key} onClick={() => callPeer(key)}>Call {key}</button>
          );
        })}
      </div>
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