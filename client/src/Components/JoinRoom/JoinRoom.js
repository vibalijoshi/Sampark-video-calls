import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import './JoinRoom.css';
import 'antd/dist/antd.css';
import { message } from 'antd';
import Navbar from '../Navbar/Navbar';
import JoinRoomSVG from './JoinRoomSVG';



const JoinRoom = (props) => {
  const {
    callAccepted,
    name,
    setName,
    stream,
    setStream,
    callUser,
    meetingCode,
    setMeetingCode,
    newMeet,
  } = useContext(SocketContext);
  useEffect(() => {
    if (!newMeet && meetingCode.length === 0) {
      props.history.push('/');
      window.location.reload();
      return;
    }
    if (stream) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        //res.getAudioTracks()[0].enabled = true;
        res.getAudioTracks()[0].enabled = false;
        setStream(res);
      });
  }, []);

  useEffect(() => {
    if (callAccepted) props.history.push('chatRoom');
  }, [callAccepted]);

  return (
    <>
      <Navbar />
      <div className='flexbox-container-joinRoom'>
        <div className="home-header-title"> Enter your name to <span className="home-header-title-blue">Sampark</span></div>
        <div className="ft-desc">
          <h1><span className="home-header-title-blue">Chat</span> before and after meetings</h1>

        </div>
        <div className="home-feature">
          <JoinRoomSVG />
        </div>
        <div className='flex-join-field' >
          <label class="field field_v1">
            <input
              autocomplete="off"
              className="field__input"
              id="html"
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <span class="field__label-wrap">
              <span class="field__label">Name</span>
            </span>
          </label>


          {newMeet ? (
            <button
              className='chatroom-meeting-btn'
              onClick={() => {
                if (name.trim().length === 0) {
                  message.error("Enter your Name!");
                  return;
                }
                props.history.push('chatroom');
              }}
            >
              Enter Room
            </button>
          ) : (
            <button
              className='chatroom-meeting-btn'
              onClick={() => {
                if (name.trim().length === 0) {
                  message.error('Please enter your name');
                  return;
                }

                callUser(meetingCode);
              }}
            >
              Join Room
            </button>
          )}
          <button
            className='chatroom-meeting-btn'
            onClick={() => {
              setMeetingCode('');
              props.history.push('/');
              window.location.reload();
            }}
          >
            Go back
          </button>

        </div>
        <div>
         <p>(Your video is not visible)</p> 
        </div>




      </div>
    </>
  );
};

export default JoinRoom;
