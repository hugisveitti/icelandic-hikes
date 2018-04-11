import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Customers from './components/customers';
import Map from './components/map'
import AddHike from './components/addHike'
import {NotificationContainer} from 'react-notifications';


function AddHikeButton(props){
    return  (
      <button onClick={props.onClick}>
        Add Hike
      </button>
    );
}

function CloseAddHikeButton(props){
    return  (
      <button onClick={props.onClick}>
        Close
      </button>
    );
}



class App extends Component {
  constructor() {
    super();
    this.state = {
      addingHike: false,
    };
    this.handleAddHike = this.handleAddHike.bind(this);
  }

  handleAddHike(){
    this.setState({addingHike: !this.state.addingHike});
  }

  render() {
    const addHikeBtn = !this.state.addingHike ? (
      <AddHikeButton onClick={this.handleAddHike} />
    ) : (
        <CloseAddHikeButton onClick={this.handleAddHike} />
    );

    const showAddHike = this.state.addingHike;

    const addHikeElement = this.state.addingHike ? (
      <AddHike />
    ) : (
      <span></span>
    )

    return (
      <div className="App">
        <NotificationContainer />
        <header className="App-header">
          <h1 className="App-title">Hikes in Iceland</h1>
        </header>
        <Map />

        {addHikeElement}
        {addHikeBtn}

      </div>
    );
  }
}

export default App;
