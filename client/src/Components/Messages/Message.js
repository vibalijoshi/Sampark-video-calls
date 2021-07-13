//component for showing chat bubbles
import { useContext } from 'react';
import { SocketContext } from '../../SocketContext';
import './Messages.css';

const Message = (props) => {
  const { me, otherUserName, name } = useContext(SocketContext);

  return (
    <div
      className={props.message.user == me ? 'message-div tr' : 'message-div tl'}
    >
      <div className="message-data">
        {props.message.user !== me && <div className="other-user-name">{otherUserName}</div>}
        {props.message.user === me && <div>You</div>}
        <div className={props.message.user == me ? 'message bg-light' : 'message bg-dark'}>  {props.message.text}</div>
        <div className= {props.message.user == me ? 'time-1' : 'time-2'}>{props.message.time}</div>
      </div>


    </div>
  );
};

export default Message;
