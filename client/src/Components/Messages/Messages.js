import React, { useState, useEffect, useRef, useContext } from 'react';
import {notification } from 'antd';
import { SocketContext } from '../../SocketContext';
import Message from './Message';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Dialog } from '@material-ui/core';
import { WarningFilled } from '@ant-design/icons';
import CloseIcon from '@material-ui/icons/Close';
import './Messages.css';
import EmpMsgSvg from './emptyMsg'
import ChatIcon from '@material-ui/icons/Chat';
import SendButtonSVG from './SendButtonSVG';
const Messages = () => {
  const {
    me,
    otherUser,
    socketState: socket,
    showChatBox,
    setShowChatBox,
    messages,
    setMessages,
    otherUserName,
  } = useContext(SocketContext);

  const [newMessage, setNewMessage] = useState('');
  const msgRef = useRef();
  //custom styles for the message dialouge
  const useStyles = makeStyles({
    dialog: {
      position: 'absolute',
      right: 10,
    }
  });
  const classes = useStyles();
  //for scrolling
  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showChatBox]);

  //click on notifications to show chat box
function clickOnNotifs()
{
  setShowChatBox(!showChatBox);
}

  // receive messages
  useEffect(() => {
    socket.on('recieve-message', (data) => {
      setMessages((messages) => [...messages, data]);
       //for notification
        notification.open({
          message: `${otherUserName}` ,
          description: data.text,
          onClick: clickOnNotifs,
          icon: <ChatIcon style={{ color: '#00BFD8' }} />,
        });
    });
    return()=>{
      socket.off('recieve-message');
    }
  }, []);

  const sendMessage = () => {
    if (newMessage.trim().length <= 0) {
      //for notification
      notification.open({
        message: `Please Enter Something!`,
        onClick: clickOnNotifs,
        placement: "topLeft",
        style: { backgroundColor: '#00BFD8'},
        icon: <WarningFilled  style={{ color: 'white' }} />,
      });
      return;
    }
    //show time 
    let time = new Date();
    let msgtimesent = `${time.getHours()}:${time.getMinutes()}`
    let tempMessage = { text: newMessage.trim(), user: me,time:msgtimesent };
    //send messages to other user
    socket.emit('send-message', {
      data: tempMessage,
      userToSend: otherUser,
    });
    setMessages((messages) => [...messages, tempMessage]);
    setNewMessage('');
  };

  //close chatbox when not in use
  const handleClose = () => {
    setShowChatBox(!showChatBox);
  };
  //send messages by pressing enter
  const handleKeypress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Dialog 
    //custom classes for Material UI Component 
    classes={{
        paper: classes.dialog,
        root:classes.dialog
      }}
      disableBackdropClick = 'true'
      onClose={handleClose}
          transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
    PaperProps={{
    style: {
      width: '400px',
      height: '90vh',
      margin: '1rem',
      borderRadius:'10px',
    },
    
  }}
  BackdropProps={{style: {backgroundColor: 'transparent'}}}
      open={showChatBox}
      onClose={handleClose}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle>
        <div className='btn-div msg-head'>
          <h3>Messages</h3>
          <button type='primary' onClick={handleClose}>
            <CloseIcon style={{ fontSize: 30 }}/>
          </button>
          
        </div>
      </DialogTitle>
      <DialogContent>
        <div className='outer-div' >
          {/* map all the messages and show it in the chat box */}
          <div className='messages scrollbar'>
            {messages.length > 0 ? (
              messages.map((item, i) => (
                <Message message={item} key={i} item={i} />
              ))
            ) : (
              
              <EmpMsgSvg/>
            )}
            <div ref={msgRef}></div>
          </div>
        </div>
        <div className="inputs-container">
        <div className='inputs'>
          {' '}
          <input
            type='text'
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            onKeyPress={handleKeypress}
            placeholder='Enter a message'
          />
          <button
            className='send-msg'
            onClick={() => {
              sendMessage();
            }}
          >
            <SendButtonSVG />
          </button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Messages;
