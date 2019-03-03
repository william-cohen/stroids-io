import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './game/Game'

class App extends Component {
  render() {
    Game();
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
