/* global google  */

import React from 'react';
import './map.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import HikeInfo from './hikeInfo.js';
import AllHikes from './allHikes.js';

//const apiKey = 'AIzaSyARkgGYzmI6y6CJoiDsIeEd5bc6s3r3_QI';

var MyMapComponent = compose(
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
        ref={props.onMarkerMounted}
        noRedraw={false}
        animation={hike.markerAni}
      >

      {hike.isOpen && <InfoWindow>
        <p>{hike.title}</p>
      </InfoWindow>}

      </Marker>
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
      markers:[],
      hikes: [],
      icon:[],
      selectedMarker : null,
      originPos:{lat: 65, lng: -18.554914},
      initPos: {lat: 65, lng: -18.554914},
      zoom: 6,
      isZoomed: false,
      map: undefined,
      addingStartLatLng:false,
      addingEndLatLng:false,
      markerAni:0
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleZoomBack = this.handleZoomBack.bind(this);
    this.handleMapClicked = this.handleMapClicked.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
    this.onMapMounted = this.onMapMounted.bind(this);
    this.onMarkerMounted = this.onMarkerMounted.bind(this);
    this.setChangeStartLatLng = this.setChangeStartLatLng.bind(this);
  }


//na i data fra server.js og firebase
  componentDidMount() {
    fetch('/api/hikes')
      .then(res => res.json())
      .then(hikes => this.setState({hikes}, () =>  {

        //tveir markerar sem verda notadir vid ad setja thgar gert er add Hike
        var nHike1 = {pos:{lng:null, lat:null},key:1,markerAni:0}
        var nHike2 = {pos:{lng:null, lat:null},key:2, markerAni:0}

        //thessi verdur notadur til ad syna endLat thegar thad a vid
        var nHike3 = {pos:{lng:null, lat:null},key:3, markerAni:0}
        hikes.push(nHike1);
        hikes.push(nHike2);
        hikes.push(nHike3)
        for(var i=0; i<this.state.hikes.length; i++){
          hikes = this.state.hikes;
          hikes[i]['markerAni'] = 0;
          hikes[i]['isOpen'] = false;
          this.setState({hikes})
          // this.state.hikes[i]['markerAni'] = 0;
          // this.state.hikes[i]['isOpen'] = false;
        }
       }
    ));
  }

  onMapMounted(ref) {
    this.setState({map:ref});
    return ref;
  }

  onMarkerMounted(ref){
    // console.log('markermount', ref)
    var markers = this.state.markers;
    markers.push(ref);
    this.setState({markers});
  }

  handleZoomChanged(){
    this.setState({zoom:this.state.map.getZoom()})
    if(this.state.map.getZoom() !== 6){
      this.setState({isZoomed: true})
    }
  }


  handleMarkerClick(marker){
    //close all newMarkerPos
    for(var i=0; i<this.state.hikes.length; i++){
      var hikes = this.state.hikes;
      hikes[i].isOpen = false;
      hikes[i].markerAni = 0;
      this.setState({hikes})
      // this.state.hikes[i].isOpen = false;
      // this.state.hikes[i].markerAni = 0;
    }
    marker.isOpen = true;
    //animation
    marker.markerAni = 4;

    this.setState({selectedMarker: marker})
    if(this.state.map.getZoom() < 10){
      this.setState({initPos:marker.pos, zoom:10, isZoomed: true});
      //marker.markerAni = 0;
    } else if(this.state.map.getZoom() < 14) {

      var zo = this.state.map.getZoom();
      this.setState({initPos:marker.pos, zoom: zo+2,isZoomed: true})
    }

    //syna endapunkt
    hikes = this.state.hikes;
    if(marker.endLat && marker.endLng){
      hikes[this.state.hikes.length - 3].pos = {lat: marker.endLat, lng: marker.endLng}
      hikes[this.state.hikes.length - 3].markerAni = 4;
      hikes[this.state.hikes.length - 3].title = 'End of ' + marker.title;
      hikes[this.state.hikes.length - 3].isOpen = true;
      var bounds = new google.maps.LatLngBounds();
      bounds.extend({lat: marker.endLat, lng: marker.endLng});
      bounds.extend({lat: marker.pos.lat, lng:marker.pos.lng})
      this.state.map.fitBounds(bounds);
    } else {

    }

    this.setState({hikes});
  }

//ef ytt er a marker og fara til baka
  handleZoomBack(){
    this.setState({initPos:this.state.originPos,zoom: 6, isZoomed:false})
  }

//fyrir ad velja nyjan marker
  handleMapClicked(obj){
      console.log(this.state.hikes)
      //senda a addhike
      this.props.sendMarker({ lng:obj.latLng.lng(),lat:obj.latLng.lat()})

      //lata marker koma thar sem ytt er a map thegar verid er ad baeta nyju hike
      var hikes = this.state.hikes;
      if(hikes.length > 2 && this.state.addingStartLatLng){
        hikes[hikes.length - 2].pos = {lng:obj.latLng.lng(),lat:obj.latLng.lat()};
      } else if(hikes.length > 2 && this.state.addingEndLatLng){
        hikes[hikes.length - 1].pos = {lng:obj.latLng.lng(),lat:obj.latLng.lat()};
      }
      this.setState({hikes});
      //TODO finna betri leid til ad rendra googleMap component
      var zo = this.state.map.getZoom();
      this.setState({zoom: zo + 4})
      this.setState({zoom: zo})
  }

  setChangeStartLatLng(bool){
    this.setState({addingStartLatLng: bool})
  }

  setChangeEndLatLng(bool){
    this.setState({addingEndLatLng: bool})
  }

  render() {
    console.log('mappjs render')
    const zoomBtn = this.state.isZoomed ? (
      <ZoomBackBtn onClick={this.handleZoomBack} />
    ) : (
      <span></span>
    );


    console.log(this.state.hikes)
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
          onMarkerMounted={this.onMarkerMounted}
          ani={this.state.markerAni}
        />
        {zoomBtn}
        <HikeInfo
          info = {this.state.selectedMarker}
        />
        <AllHikes
          hikes = {this.state.hikes}
          num = {7}
        />
      </div>
    )
  }
}

export default Map;
