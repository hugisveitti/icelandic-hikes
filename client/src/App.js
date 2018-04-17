import React, { Component } from 'react';
import './App.css';
import Map from './components/map'
import AddHike from './components/addHike'


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
      newMarkerPos:{lat:0, lng:0}
    };
    this.handleAddHike = this.handleAddHike.bind(this);
    this.sendMarker = this.sendMarker.bind(this);
    this.setChangingStartLatLng = this.setChangingStartLatLng.bind(this);
    this.setChangingEndLatLng = this.setChangingEndLatLng.bind(this);
    this.addHikeChild = React.createRef();
    this.mapRef = React.createRef();
    this.showAbout = this.showAbout.bind(this);
  }

  handleAddHike(){
    this.setState({addingHike: !this.state.addingHike});
  }

  setChangingStartLatLng(bool){
    this.mapRef.current.setChangeStartLatLng(bool);
  }

  setChangingEndLatLng(bool){
    this.mapRef.current.setChangeEndLatLng(bool);
  }

//thegar notandi ytir a kortid
  sendMarker(param){
    console.log('param', param)
    if(this.state.addingHike){
      this.setState({newMarkerPos: param})
      this.sendMarkerToChild();
    }
  }

  sendMarkerToChild(){
    this.addHikeChild.current.getPos(this.state.newMarkerPos);
  }

  showAbout(){

  }

  render() {
    const addHikeBtn = !this.state.addingHike ? (
      <AddHikeButton onClick={this.handleAddHike} />
    ) : (
        <CloseAddHikeButton onClick={this.handleAddHike} />
    );

    //const showAddHike = this.state.addingHike;

    const addHikeElement = this.state.addingHike ? (
      <AddHike
        ref={this.addHikeChild}
        newMarkerPos={this.state.newMarkerPos}
        setChangingStartLatLng={this.setChangingStartLatLng}
        setChangingEndLatLng={this.setChangingEndLatLng}
      />
    ) : (
      <span></span>
    )

    return (

      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hikes in Iceland</h1>

        </header>
        <Map
          addingHike={this.addingHike}
          sendMarker={this.sendMarker}
          ref={this.mapRef}
        />

        {addHikeElement}
        {addHikeBtn}
        <footer className="App-footer">
          <p>Site made by Hugi Holm, if you have any suggestions contact me: hugiholm1@gmail.com</p>
        </footer>
      </div>
    );
  }
}

export default App;
