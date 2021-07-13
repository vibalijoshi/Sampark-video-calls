//component for bottom options on the meet page
import React, { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Options.css';
import 'antd/dist/antd.css';
import Menu from '@material-ui/core/Menu';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { Button, message } from 'antd';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import ChatIcon from '@material-ui/icons/Chat';
import Messages from '../Messages/Messages';
import Notes from '../Notes/Notes';
import CancelIcon from '@material-ui/icons/Cancel';
import { APP_URL } from '../../constants';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CallEndRoundedIcon from '@material-ui/icons/CallEndRounded';
import CreateIcon from '@material-ui/icons/Create';
import Clock from 'react-digital-clock';
const Options = (props) => {
  const [callId, setCallId] = useState('');

  const {
    me,
    call,
    callAccepted,
    callEnded,
    name,
    setCall,
    answerCall,
    endCall,
    myVideoStatus,
    myMicStatus,
    updateMicStatus,
    updateVideoStatus,
    showEditor,
    showChatBox,
    setShowChatBox,
    setShowEditor,
  } = useContext(SocketContext);
  

  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileView, setMobileView] = useState(false);
  const resize = () => {
    setMobileView(window.innerWidth <= 600);
  };
  // resize window
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //event tells us if the call is accepted or not
  useEffect(() => {
    if (call && call.isRecievedCall && !callAccepted) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [call, callEnded]);

  return (
    <>
      <div className= 'options'>
      <Clock format={'hh-mm'} />
      {/* video, audio, end call buttons */}
      <div className = 'options left-side-options'>
        <button
          onClick={() => updateVideoStatus()}
          className={!myVideoStatus ? 'bg-grey tooltip' : 'bg-white tooltip'}
        >
          {myVideoStatus ? <VideocamIcon /> : <VideocamOffIcon />}
          <span className='tooltiptext'>
            {myVideoStatus ? 'Turn off video' : 'Turn on video'}
          </span>
        </button>
        <button
          className='red-btn tooltip'
          type='primary'
          onClick={() => {
            endCall(props.history);
          }}
        >
          <CallEndRoundedIcon />
          <span className='tooltiptext'>End call</span>
        </button>

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
        </div>
        {/* buttons on the right side */}
        <div className = 'options right-side-options'>
        <button className='tooltip' onClick={handleClick}>
          <PersonAddIcon />
          <span className='tooltiptext'>Invite</span>
        </button>
        
        <Notes />
        <button
          className='tooltip'
          type='primary'
          onClick={() => 
            setShowChatBox(!showChatBox)            
          }
          
        >
          <ChatIcon />
          <span className='tooltiptext'>Messages</span>
        </button>
          <button
            className={showEditor ? 'bg-grey tooltip' : 'bg-white tooltip'}
            type='primary'
            onClick={() => {
              setShowEditor(!showEditor);
            }}
          >
            <CreateIcon />
            <span className='tooltiptext'>Whiteboard</span>
          </button>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        >
          <div className='options-menu'>
            <div className='btn-div'>
              <h3>Sampark a friend {name}!</h3>
              <button type='primary' onClick={handleClose}>
                <CancelIcon/>
              </button>
            </div>
            <div>
              <CopyToClipboard
                text={`${APP_URL}?${me}`}
                onCopy={() => {
                  message.success('Url Copied');
                  handleClose();
                }}
              >
              <Button className="btn">Copy Link</Button>
              </CopyToClipboard>
              <CopyToClipboard
                text={me}
                onCopy={() => {
                  message.success('Id Copied');
                  handleClose();
                }}
              >
                <Button className = "btn">Copy ID</Button>
              </CopyToClipboard>
            </div>
          
          </div>
        </Menu>
        {/* alert when the other user joins */}
        {call && (
            <Dialog open={open} aria-labelledby='draggable-dialog-title'
              PaperProps={{
                style: {
                  padding: '20px'
                },
              }}>
            <DialogContent>
              <div className='call-div'>
              <p>{call.callerName} wants to Sampark</p>
                <div className='flex'>
                  <Button
                    type='primary'
                    onClick={() => {
                      answerCall();
                      setOpen(false);
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => {
                      setCall(null);
                      setOpen(false);
                    }}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Messages />
      </div>
      </div>
    </>
  );
};

export default Options;
