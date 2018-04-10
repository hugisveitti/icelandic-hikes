import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Customers from './components/customers';
import Map from './components/map'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hikes in Iceland</h1>
        </header>

        <Map />

      </div>
    );
  }
}

export default App;
