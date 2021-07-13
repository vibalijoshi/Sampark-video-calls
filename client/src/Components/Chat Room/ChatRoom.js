//component for the chat room before and after meetings
import { useState, useEffect, useRef, useContext } from "react";
import { Button, message, notification } from "antd";
import { SocketContext } from "../../SocketContext";
import Message from "../Messages/Message";
import DialogContent from "@material-ui/core/DialogContent";
import { Dialog } from "@material-ui/core";
import WarningFilled from "@ant-design/icons";
import './chatroom.css'
import "../Messages/Messages.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { APP_URL } from '../../constants';
import EmpMsgSvg from '../Messages/emptyMsg'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Menu from '@material-ui/core/Menu';
import CancelIcon from '@material-ui/icons/Cancel';

const ChatRoom = (props) => {
    const {
        me,
        call,
        otherUser,
        socketState: socket,
        messages,
        setMessages,
        name,
        answerCall,
        setCall,
        callEnded,
        callAccepted,
        leaveChatRoom,
        newMeet,
        setShowOtherUserVideo,
    } = useContext(SocketContext);
    const [open, setOpen] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const msgRef = useRef();
    //scrolls to the bottom when a new message arrives
    useEffect(() => {
        if (msgRef.current) msgRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    //managing state for call accepted
    useEffect(() => {
        if (call && call.isRecievedCall && !callAccepted) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [call, callEnded]);

    useEffect(() => {
        //recieving message
        socket.on("recieve-message", (data) => {
            setMessages((messages) => [...messages, data]);
        });
        //event for Other person allowed me to see him
        socket.on('showVideoToOtherUser', () => {
            setShowOtherUserVideo(true);
        });

        //event that notifies that the other person has left the chatroom
        socket.on("chatRoomEnded", () => {
            notification.open({
                message: `Other User left`,
                placement: "topLeft",
                style: { backgroundColor: '#00BFD8' },
                icon: <WarningFilled style={{ color: "white" }} />,
            })
        })
        return () => {
            //clean up function to close the socket events when the component unmounts
            socket.off("recieve-message");
            socket.off("chatRoomEnded");
        };
    }, []);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //function to send message
    const sendMessage = () => {
        if (newMessage.trim().length <= 0) {
            notification.open({
                message: `Please Enter Something!`,
                placement: "topLeft",
                style: { backgroundColor: '#00BFD8' },
                icon: <WarningFilled style={{ color: "white" }} />,
            });
            return;
        }
        //responsible for storing the time of the texts
        let time = new Date();
        let msgtimesent = `${time.getHours()}:${time.getMinutes()}`
        let tempMessage = { text: newMessage.trim(), user: me, time: msgtimesent };
        socket.emit("send-message", {
            data: tempMessage,
            userToSend: otherUser,
        });
        setMessages((messages) => [...messages, tempMessage]);
        setNewMessage("");
    };

    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chatroom-container">
            <div className="chatroom-container-upper">
                <div className="chatroom-header">
                    <div className="chatroom-header-title">
                        Sampark
                    </div>
                    <div className="chatroom-button-container">
                        {newMeet ? (
                            <button className='chatroom-meeting-btns tooltip invite-css' onClick={handleClick}>
                                <span style={{ marginRight: '1em' }}>Invite</span>  <PersonAddIcon />
                                <span className='tooltiptext'>Invite</span>
                            </button>
                        ) :
                            (
                                (null)
                            )}
                        {/* container for the invite button message */}
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
                                        <CancelIcon />
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
                                        <Button className="btn">Copy ID</Button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </Menu>
                        <button
                            className="chatroom-meeting-btns"
                            onClick={() => {
                                if (name.trim().length === 0) {
                                    message.error("Enter your Name!");
                                    return;
                                }
                                props.history.push("join");
                            }}>
                            Join Video Call
                        </button>

                        <button className="chatroom-meeting-btns leave-room"
                            onClick={() => { leaveChatRoom(props.history) }}

                        >
                            Leave Room
                        </button>
                    </div>
                </div>
                {/* Messages are displayed here */}
                <div className="chatroom-message-desc">
                    Messages
                </div>
                <div className="chatroom-messages">
                    {messages.length > 0 ? (
                        messages.map((item, i) => (
                            <Message message={item} key={i} item={i} />
                        ))
                    ) : (
                        <div>
                            <div className='chatroom-message-desc'>
                                {newMeet ? (<p>It is quite empty here..maybe invite someone?</p>) : (<p>It is quite empty here...start chatting or join the call!</p>)}

                            </div>
                            <div className='chatroom-message-desc'>
                                <EmpMsgSvg />
                            </div>
                        </div>

                    )}
                    <div ref={msgRef}>
                    </div>
                </div>
            </div>
            <div className="chatroom-container-input">
                <div className="chatroom-input-master">
                    <input
                        className="chatroom-msg-input"
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                        }}
                        onKeyPress={handleKeypress}
                        placeholder="Enter a message"
                    />
                    <button
                        className="chatroom-msg-send"
                        onClick={() => {
                            sendMessage();
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
            {/* alert for accepting the user */}
            {call && (
                <Dialog open={open} aria-labelledby="draggable-dialog-title"
                    PaperProps={{
                        style: {
                            padding: '20px'
                        },
                    }}
                >
                    <DialogContent>
                        <div className="call-div">
                            <p>{call.callerName} wants to Sampark</p>
                            <div className="flex">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        answerCall();
                                        setOpen(false);
                                    }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    type="primary"
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
        </div>
    )
}

export default ChatRoom;
