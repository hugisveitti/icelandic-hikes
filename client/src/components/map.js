/* global google  */

import React from 'react';
import './map.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps, withHandlers } from 'recompose';
import HikeInfo from './hikeInfo.js';
import AllHikes from './allHikes.js';
import SideHikes from './sideHikes.js'
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';

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
);

function ZoomBackBtn(props){
  return(
    <button onClick={props.onClick}>
      Zoom Back
    </button>
  );
}

function HideOtherMarkersBtn(props){
  var value = 'Hide';

  if (props.hidingOtherMarkers){
    value = 'Show'
  }
  return(
    <button onClick={props.onClick}>
      {value} Other Markers
    </button>
  )
}


export class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      markers:[],
      hikes: [],
      originalHikesPos: [],
      icon:[],
      selectedMarker : null,
      selectedMarkerInfo:null,
      originPos:{lat: 65, lng: -18.554914},
      initPos: {lat: 65, lng: -18.554914},
      zoom: 6,
      isZoomed: false,
      map: undefined,
      addingStartLatLng:false,
      addingEndLatLng:false,
      markerAni:0,
      markerSelected: false,
      hidingOtherMarkers: false,
      showSideNav:false,
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleZoomBack = this.handleZoomBack.bind(this);
    this.handleMapClicked = this.handleMapClicked.bind(this);
    this.handleZoomChanged = this.handleZoomChanged.bind(this);
    this.onMapMounted = this.onMapMounted.bind(this);
    this.onMarkerMounted = this.onMarkerMounted.bind(this);
    this.setChangeStartLatLng = this.setChangeStartLatLng.bind(this);
    this.setSelectedMarker = this.setSelectedMarker.bind(this);
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

        var originalHikesPos = [];
        for(var j=0; j<hikes.length; j++){
          var obj = {pos:{lng:hikes[j].pos.lng, lat:hikes[j].pos.lat}}
          originalHikesPos.push(obj);
        }

        //var  originalHikesPos = hikes.slice();
        this.setState({originalHikesPos});
       }
    ));
  }

  onMapMounted(ref) {
    this.setState({map:ref});
    return ref;
  }

  onMarkerMounted(ref){
    // console.log('markermount', ref)
    // var markers = this.state.markers;
    // markers.push(ref);
    // this.setState({markers});
  }

  handleZoomChanged(){
    this.setState({zoom:this.state.map.getZoom()})
    if(this.state.map.getZoom() !== 6){
      this.setState({isZoomed: true})
    }
  }


  handleMarkerClick(marker){
    //fyrir hide markers takkann
    this.setState({markerSelected:true})
    this.setState({selectedMarkerInfo:marker});
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
    } else if(this.state.map.getZoom() < 12) {

      var zo = this.state.map.getZoom();
      this.setState({initPos:marker.pos, zoom: zo+1,isZoomed: true})
    } else {
      this.setState({initPos:marker.pos, zoom: 10, isZoomed:true})
    }

    //syna endapunkt
    hikes = this.state.hikes;
    if(marker.endLat && marker.endLng){
      hikes[this.state.hikes.length - 3].pos = {lat: marker.endLat, lng: marker.endLng}
      hikes[this.state.hikes.length - 3].markerAni = 4;
      hikes[this.state.hikes.length - 3].title = 'End of ' + marker.title;
      hikes[this.state.hikes.length - 3].isOpen = true;
      //ef thad er endapunktur tha zoom inn a tha bada
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


  //ef ytt er a hide other markers takkann
  handleHideOtherMarkers(){
    console.log('hide')
    var hikes = this.state.hikes;
    console.log(this.state.hidingOtherMarkers)
    console.log(this.state.hikes)
    console.log(this.state.selectedMarkerInfo)
    if(!this.state.hidingOtherMarkers && this.state.selectedMarkerInfo){
      //hide markers
      for(var i=0; i<hikes.length-3; i++){
        if(hikes[i].key !== this.state.selectedMarkerInfo.key){
          hikes[i]['pos'] = null;
        }
      }
      this.setState({hikes});
    } else {
      //show other markers
      hikes = this.state.hikes;
      for(var j=0; j<this.state.originalHikesPos.length; j++){
          hikes[j].pos = this.state.originalHikesPos[j].pos;
      }
    }
    this.setState({hikes});
    var oldHidingOtherMarkers = this.state.hidingOtherMarkers;
    this.setState({hidingOtherMarkers:!oldHidingOtherMarkers});

    //TODO finna betri leid til ad rendra googleMap component

    var zo = this.state.map.getZoom();
    console.log(zo);
    if(zo > 6){
      this.setState({zoom:zo - 1})
    } else {
      this.setState({zoom: zo + 1})
    }
    //mapid updatesast illa
    // this.setState({zoom: zo})
  }

//fyrir ad velja nyjan marker
  handleMapClicked(obj){
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

//triggerar hikeInfo
  setSelectedMarker(marker){
    var hikes = this.state.hikes;
    for(var i=0; i<this.state.hikes.length; i++){
      hikes[i].isOpen = false;
      hikes[i].markerAni = 0;
    }
    this.setState({hikes})
    this.setState({
      selectedMarker: marker,
      markerSelected:false,
      zoom:this.state.map.getZoom()-2,
      selectedMarkerInfo:marker
      });
  }



//ekki notad ef sidenav er notad
    setFromListSelectedMarker(marker){
      this.setState({
        selectedMarker:marker
      })

      //this.handleMarkerClick(markerKey);

      var hikes = this.state.hikes;
      for(var i=0; i<this.state.hikes.length; i++){
        hikes[i].isOpen = false;
        hikes[i].markerAni = 0;
      }

      //ef ytt a sama tvisvar tha hverfur infotitle og end lat
      if(this.state.selectedMarkerInfo && marker.key === this.state.selectedMarkerInfo.key){
        hikes[this.state.hikes.length - 3].pos = null;
        //setja null svo haegt se ad yta aftur
        this.setState({
          selectedMarkerInfo:null,
          initPos:this.state.originPos,
          markerSelected:false,
          hidingOtherMarkers:false,
          zoom:7
        });
        marker.isOpen = false;
        marker.markerAni = 0;

      } else{
        if(marker.endLat && marker.endLng){


          hikes[this.state.hikes.length - 3].pos = {lat: marker.endLat, lng: marker.endLng}
          hikes[this.state.hikes.length - 3].markerAni = 4;
          hikes[this.state.hikes.length - 3].title = 'End of ' + marker.title;
          hikes[this.state.hikes.length - 3].isOpen = true;
          this.setState({hikes});
          console.log(this.state.hikes)
          var bounds = new google.maps.LatLngBounds();
          bounds.extend({lat: marker.endLat, lng: marker.endLng});
          bounds.extend({lat: marker.pos.lat, lng:marker.pos.lng})
          this.state.map.fitBounds(bounds);
        }

          this.setState({
            selectedMarkerInfo:marker,
            initPos:marker.pos,
            markerSelected:true,
            hidingOtherMarkers: false
          });
          marker.isOpen = true;
          //animation
          marker.markerAni = 4;
      }

      //syna alla markera sama hvad, passa end
      for(var j=0; j<this.state.originalHikesPos.length-3; j++){
          hikes[j].pos = this.state.originalHikesPos[j].pos;
      }

      this.setState({hikes});


      if(this.state.map.getZoom() > 6){
        this.setState({zoom: this.state.map.getZoom() - 1})
      } else {
        this.setState({zoom: this.state.map.getZoom() + 1})
      }

    }

    toggleSideNav(){
      var showSideNav = this.state.showSideNav;
      this.setState({showSideNav:!showSideNav})
    }


  render() {
    const zoomBtn = this.state.isZoomed ? (
      <ZoomBackBtn onClick={this.handleZoomBack} />
    ) : (
      <span></span>
    );

    const hideOtherMarkers = this.state.markerSelected ? (
      <HideOtherMarkersBtn
       hidingOtherMarkers={this.state.hidingOtherMarkers}
       onClick={this.handleHideOtherMarkers.bind(this)} />
    ) : (
      <span></span>
    );


    return (
      <div>
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
          {hideOtherMarkers}
          {zoomBtn}
          <HikeInfo
            info = {this.state.selectedMarker}
            setSelectedMarker={(marker) => this.setSelectedMarker(marker)}
          />
          </div>
          <div
            className="side-nav-nibbi nibbi-opna"
            onClick={this.toggleSideNav.bind(this)}>
          </div>
          <SideHikes
            className="side-nav"
            hikes={this.state.hikes}
            show={this.state.showSideNav}
            setFromListSelectedMarker={this.setFromListSelectedMarker.bind(this)}
          />
          <div
            className="side-nav-nibbi nibbi-loka"
            onClick={this.toggleSideNav.bind(this)}
            style={{display:this.state.showSideNav?'block':'none'}}>
          </div>
      </div>
    )
  }
}

// <AllHikes
//   hikes = {this.state.hikes}
//   num = {7}
//   setFromListSelectedMarker={this.setFromListSelectedMarker.bind(this)}
// />

export default Map;
