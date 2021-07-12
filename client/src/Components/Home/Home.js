import { useContext, useEffect } from 'react';
import { SocketContext } from '../../SocketContext';
import { message } from 'antd';
import Navbar from '../Navbar/Navbar';
import './Home.css';
import Footer from './Footer';
import HeaderSVG from './HeaderSVG';
import MeetingSVG from './MeetingSVG';
import SecureSVG from './SecureSVG';
import CollaborationSVG from './CollaborationSVG';


const Home = (props) => {
  const paramsCode = props.location.search;
  const { meetingCode, setMeetingCode, setNewMeet } = useContext(SocketContext);

  useEffect(() => {
    if (paramsCode.length) {
      if (paramsCode.substring(0, 5) == '?ref=') return; // for product hunt ref
      setMeetingCode(paramsCode.substring(1));
    }
    setNewMeet(null);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="home-header" >
        <div className="home-header-desc">
          <div className="home-header-title"><span className="home-header-title-blue">Let's Sampark</span> with ease</div>
          <div className="ft-desc-head">
            <h1>Connect through instant chat rooms and video calls.</h1>

          </div>

          <div className="home-meet-join-container">
            <button
              className="home-meeting-start"
              onClick={() => {
                setNewMeet(true);
                props.history.push('joinRoom');
              }}>
              Create Room
            </button>
            or
            <input
              className="home-meeting-code"
              type='text'
              placeholder='Enter room code to join'
              value={meetingCode || ''}
              onChange={(e) => {
                setMeetingCode(e.target.value);
              }} />
            {meetingCode.length > 0 && <button
              className="home-join-meeting"
              onClick={() => {
                if (!meetingCode || meetingCode.trim().length === 0) {
                  message.error('Please enter the meeting code');
                  return;
                }
                props.history.push('joinRoom');
              }}>
              Join Room
            </button>
            }
          </div>
        </div>
        <HeaderSVG />

      </div>
      <div className="ft-desc-center">
        <h1>How <span className="home-header-title-blue">Sampark</span> connects you</h1>
      </div>
      <div className="home-feature">

        <MeetingSVG />

        <div className="ft-desc">
          <h1>Create Rooms and Start Meetings instantly</h1>
          <p>No login required. Fast and effective messaging and calls.</p>
        </div>
      </div>
      <div className="home-feature">
        <div className="ft-desc">
          <h1>Secure and Safe Rooms</h1>
          <p>Allow others to enter room and join video call.</p>
        </div>
        <SecureSVG />
      </div>
      <div className="home-feature">
        <CollaborationSVG />
        <div className="ft-desc">
          <h1>Make your meetings productive</h1>
          <p> Collaborate together on virtual whiteboard. Write notes during calls and save them for later. Code along, annotate your content and a lot more!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
