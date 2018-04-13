/* global google  */

import React, { Component } from 'react';
import './map.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps, withState, withHandlers } from 'recompose';
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
    defaultZoom={props.defZoom}
    defaultCenter={props.pos}
    center={props.pos}
    zoom={props.zoom}
    onClick={props.mapClicked}
    onZoomChanged={props.zoomChanged}
    ref={props.onMapMounted}
  >
  {props.markers.map((hike, index) => {
    return (
      <Marker
        position={hike.pos}
        onClick={() => props.onMarkerClick(hike)}
        key={hike.key}
        icon={props.icon}
      />
    )
  })}
  </GoogleMap>
)

function ZoomBackBtn(props){
  return(
    <button onClick={props.onClick}>
      Zoom Back
    </button>
  );
}


export class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      hikes: [],
      icon:[],
      selectedMarker : ['yo'],
      originPos:{lat: 65, lng: -18.554914},
      initPos: {lat: 65, lng: -18.554914},
      zoom: 6,
      isZoomed: false,
      map: undefined
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleZoomBack = this.handleZoomBack.bind(this);
    this.handleMapClicked = this.handleMapClicked.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
    this.onMapMounted = this.onMapMounted.bind(this);
  }


//na i data fra server.js og firebase
  componentDidMount() {
    fetch('/api/hikes')
      .then(res => res.json())
      .then(hikes => this.setState({hikes}, () =>  {
       }
    ));
  }

  onMapMounted(ref) {
    this.setState({map:ref});
    return ref;
  }


  handleZoomChanged(){
    this.setState({zoom:this.state.map.getZoom()})
    if(this.state.map.getZoom() != 6){
      this.setState({isZoomed: true})
    }
  }

  handleMarkerClick(marker){
    this.setState({selectedMarker: marker})
    this.setState({initPos:marker.pos, zoom:10, isZoomed: true});
    console.log(this.state.icon);
  }

//ef ytt er a marker og fara til baka
  handleZoomBack(){
    this.setState({initPos:this.state.originPos,zoom: 6, isZoomed:false})
  }

//fyrir ad velja nyjan marker
  handleMapClicked(obj){
      this.props.sendMarker({lat:obj.latLng.lat(), lng:obj.latLng.lng()})
      console.log('map clicked')
  }


  render() {

    const zoomBtn = this.state.isZoomed ? (
      <ZoomBackBtn onClick={this.handleZoomBack} />
    ) : (
      <span></span>
    );

    return (
      <div className="main-container">
        <MyMapComponent
          pos={this.state.initPos}
          markers={this.state.hikes}
          onMarkerClick={this.handleMarkerClick}
          mapClicked={this.handleMapClicked}
          zoomChanged={this.handleZoomChanged}
          onMapMounted={this.onMapMounted}
          defZoom={6}
          zoom={this.state.zoom}
          icon={this.state.icon}
        />
        {zoomBtn}
        <HikeInfo
          info = {this.state.selectedMarker}
        />
      </div>
    )
  }
}

export default Map;
