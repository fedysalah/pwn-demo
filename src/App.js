import React, { Component } from 'react';
import './styles/App.css';
import { Header } from './components';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Program, Speakers, NoMatch, Favorites } from './pages';


const updateOnlineIndicator = (offlineMessage, onlineMessage) => {

  const elem = navigator.onLine ? onlineMessage : offlineMessage;
  if (elem) {
    elem.classList.add('show');
    setTimeout(() => {
      elem.classList.remove('show');
    }, 4000)
  }
}


class App extends Component {

  componentDidMount() {
    const jug = document.getElementById('jug');
    window.addEventListener('online',  () => {
      const jug = document.getElementById('jug');
      const onlineMessage = document.getElementById('online-message');
      const offlineMessage = document.getElementById('offline-message');
      if (jug) {
        jug.classList.remove('offline');
      }
      updateOnlineIndicator(offlineMessage, onlineMessage);
    });
    window.addEventListener('offline',  () => {
      const jug = document.getElementById('jug');
      const onlineMessage = document.getElementById('online-message');
      const offlineMessage = document.getElementById('offline-message');
      if (jug) {
        jug.classList.add('offline');
      }
      updateOnlineIndicator(offlineMessage, onlineMessage)
    });
  }

  render() {
    return (
      <BrowserRouter basename='/'>
        <div>
            <Switch>
              <Route exact path="/" component={Program} />
              <Route exact path="/program" component={Program} />
              <Route path="/program/:talkId" render={({match}) => <Program talkId={match.params.talkId}/>} />
              <Route exact path="/speakers" component={Speakers} />
              <Route path="/speakers/:speakerId" render={({match}) => <Speakers speakerId={match.params.speakerId}/>} />
              <Route path="/favorites" component={Favorites} />
              <Route component={NoMatch} />
            </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
