import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './game/Game'

class App extends Component {
  constructor(props: any) {
    super(props);
    //const username = prompt('Enter a username');
    const username = "TestDev_" + Math.floor(Math.random()*10);
    new Game(username);
  }
  render() {
    return (
      <div className="App"></div>
    );
  }
}

export default App;
