// Routing of the web application handled here
import { useEffect } from 'react';
import './App.css';
import Meet from './Components/Meet/Meet';
import Join from './Components/Join/Join';
import Home from './Components/Home/Home';
import { ContextProvider } from './SocketContext';
import Message from './Components/Messages/Message';
import JoinRoom from './Components/JoinRoom/JoinRoom';
import ChatRoom from './Components/Chat Room/ChatRoom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

function App() {
  //if application is not connected to the internet, display this alert.
  useEffect(() => {
    if (!navigator.onLine) alert('Connect to internet!');
  }, [navigator]);

  return (
    //SocketContect provider for the components
    <ContextProvider>
      <Router>
        <Switch>
          <Route path='/' component={Home} exact></Route>
          <Route path='/meet' component={Meet}></Route>
          <Route path='/message' component={Message}></Route>
          <Route path='/join' component={Join}></Route>
          <Route path='/joinRoom' component={JoinRoom}></Route>
          <Route path='/chatRoom' component={ChatRoom}></Route>
        </Switch>
      </Router>
    </ContextProvider>
  );
}

export default App;
