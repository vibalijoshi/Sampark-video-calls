import { useContext, useEffect, useRef} from 'react';
import { SocketContext } from '../../SocketContext';
import './Join.css';
import '../Options/Options.css';
import 'antd/dist/antd.css';
import { message } from 'antd';
import Spinner from '../../common/Spinner';
import Navbar from '../Navbar/Navbar';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

const Join = (props) => {
  const {
    socketState: socket,
    name,
    setName,
    stream,
    setStream,
    callUser,
    meetingCode,
    setMeetingCode,
    newMeet,
    myMicStatus,
    updateVideoStatus,
    myVideoStatus,
    updateMicStatus,
    otherUser,
    showVideoToOtherUser
  } = useContext(SocketContext);

  //reference for my video
  const myPreviewVideo = useRef();

  useEffect(() => {
    if (!newMeet && meetingCode.length === 0) {
      props.history.push('/');
      window.location.reload();
      return;
    }
    //to get the video and audio
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((res) => {
        res.getAudioTracks()[0].enabled = false;
        myPreviewVideo.current.srcObject = res;
      });
  }, []);

  return (
    <>
      <Navbar />
      
      <div className='flexbox-join-page'>
        <div className="flexbox-join-enter-button">
          <h1>Your video appears like this</h1>
          
          
          {/* video preview */}
          <div className='video-div'>
            {stream ? (
              <video
                src=''
                ref={myPreviewVideo}
                autoPlay
                muted
              ></video>
            ) : (
              <Spinner />
            )}
          </div>
          {/* video controls (mute/unmute, video off/video on) */}
          <div className="flexbox-control-aud-vid">
                <button
                  onClick={() => updateMicStatus()}
                  type='primary'
                  className={!myMicStatus ? 'bg-grey tooltip' : 'bg-white tooltip'}
                >
                  {' '}
                  {myMicStatus ? <MicIcon /> : <MicOffIcon />}
                  <span className='tooltiptext'>
                    {myMicStatus ? 'Turn off mic' : 'Turn on mic'}
                  </span>
                </button>
                <button

                  onClick={() => updateVideoStatus()}
                  className={!myVideoStatus ? 'bg-grey tooltip' : 'bg-white tooltip'}
                >
                  {myVideoStatus ? <VideocamIcon /> : <VideocamOffIcon />}
                  <span className='tooltiptext'>
                    {myVideoStatus ? 'Turn off video' : 'Turn on video'}
                  </span>
                </button>
              </div>
        </div>
        {/* name input */}
        {stream && (
          <>
            <div className="flexbox-join-enter-button">
              <div className="flexbox-join-enter">
                <label class="field field_v1">
                  <input
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

                {/* show start for the host and join for others */}
                {newMeet ? (
                  <button
                    className='chatroom-meeting-btn'
                    onClick={() => {
                      if (name.trim().length === 0) {
                        message.error("Enter your Name!");
      
                        return;
                      }
                      if(otherUser) showVideoToOtherUser();
                      console.log(otherUser);
                      props.history.push('meet');
                    }}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    className='chatroom-meeting-btn'
                    onClick={() => {
                      if (name.trim().length === 0) {
                        message.error('Please enter your name');
                        
                        return;
                      }
                      if(otherUser) showVideoToOtherUser();
                      callUser(meetingCode);
                      props.history.push('meet');
                    }}
                  >
                    Join
                  </button>
                )}
                <button
                  className='chatroom-meeting-btn'
                  onClick={() => {
                    props.history.push('chatRoom');
                  }}
                >
                  Leave
                </button>
              </div>
            </div>
          </>

        )}

      </div>
    </>
  );
};

export default Join;
