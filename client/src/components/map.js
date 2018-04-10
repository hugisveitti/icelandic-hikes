/* global google  */

import React, { Component } from 'react';
import './map.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import HikeInfo from './hikeInfo.js'


//const apiKey = 'AIzaSyARkgGYzmI6y6CJoiDsIeEd5bc6s3r3_QI';
const pos = {lat: 65, lng:-18.554919};


const MyMapComponent = compose(
  withProps({
    googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyARkgGYzmI6y6CJoiDsIeEd5bc6s3r3_QI&v=3.exp&libraries=geometry,drawing,places",
    loadingElement:<div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={props.zoom}
    defaultCenter={props.pos}
    center={props.pos}
    zoom={props.zoom}
  >
  {props.markers.map((marker, index) => {
    return (
      <Marker
      position={marker.pos}
      onClick={() => props.onMarkerClick(marker)}
      />
    )
  })}
  </GoogleMap>
)




export class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      hikes: [],
      selectedMarker : ['yo'],
      initPos: {lat: 65, lng: -18.554914},
      zoom: 6,
      isZoomed: false
    };
  }

  handleMarkerClick = this.handleMarkerClick.bind(this);


//na i data fra server.js
  componentDidMount() {
    console.log('did mount')
    fetch('/api/hikes')
      .then(res => res.json())
      .then(hikes => this.setState({hikes}, () =>  {
         console.log('hikes fetched...', hikes);
    }
  ));
  }


  handleMarkerClick(marker){
    this.setState({selectedMarker: marker})
    this.setState({initPos:marker.pos, zoom:10, isZoomed: true});
  }






  render() {
    console.log('render');
    return (
      <div className="main-container">
        <MyMapComponent
          zoom = {this.state.zoom}
          pos = {this.state.initPos}
          markers={this.state.hikes}
          onMarkerClick={this.handleMarkerClick}
        />
      <HikeInfo
        info = {this.state.selectedMarker}
      />
      </div>
    )
  }
}

export default Map;
