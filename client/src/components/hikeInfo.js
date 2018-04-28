import React from 'react';
import './hikeInfo.css'
import axios from 'axios';
import { browserHistory } from 'react-router';

export class HikeInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      info: []
    };
    this.downloadGpsRoute = this.downloadGpsRoute.bind(this);
  }

  closeInfo(){
    this.props.setSelectedMarker(null);
  }

  suggestAnEdit(){

  }

  //
  // headers: {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json',
  // },
  // body: JSON.stringify(sendData)

  downloadGpsRoute(fileName){
    console.log(fileName);
    var path = 'http://localhost:5000/downloadGpsRoute:' + fileName;
    // };
    console.log(path)
    // fetch('http://localhost:5000/downloadGpsRoute/:id', {
    // // fetch('http://icelandichikes.com/api/addHikes', {
    //
    //  }).then((res) => {
    //    console.log('res',res)
    //  }).catch((err) => {
    //    console.log('err',err)
    //  });

    if(window){
      window.open(path);
    }
   }

//faer eitt hike og setur thad fyrir nedan kortid
    render(){
      const info = this.props.info;
      if(info && info.title !== " " && info.length){

          const HasSameStartFinish = !info.endLng  ? (
              <li>Hike has the same starting and finish point</li>
            ) : (
              <div>
              <li>Hike does not have the same starting and finish point</li>
              <li>The end point is lat: {info.endLat}, lng: {info.endLng}</li>
              </div>
            )

            const IsLoop = info.isLoop ? (
              <li>Hike is a loop</li>
            ) : (
              <div>
              <li>Hike is not a loop</li>
              {HasSameStartFinish}
              </div>
            )


            const gpsRoutes = info.gpsRouteFileName && info.gpsRouteFileName !== "" ? (
              <li> GPS routes
                <div>
                  <p>
                    You can download the gps route and open it with your smart phone in a app such as Geo Tracker.
                  </p>
                  <br />
                  <p>
                    {info.gpsRouteFileName}
                  </p>
                  <button onClick={() => this.downloadGpsRoute(info.gpsRouteFileName)}>Download Route</button>
                </div>
              </li>
            ) : (<span />)

            //const HikeHasRiverCrossings = info.

        return (
          <div className="hike-info" onClick={this.props.toggleSideNav}>
            <h1 className="hike-info-title">{info.title}</h1>
            <button className="close-hike-info" onClick={this.closeInfo.bind(this)}>X</button>
            <ul>
              <li className="description">{info.description}</li>
              <li>Difficulty is {info.difficulty}</li>
              <li>Length is {info.length} meters</li>
              <li>Duration is {info.duration}</li>
              <li>Elevation is {info.elevation} meters</li>
              {IsLoop}
              {gpsRoutes}
            </ul>
            <button onClick={this.suggestAnEdit.bind(this)}>
              Suggest an edit
            </button>
          </div>
        )
      } else {
        return (
          <div></div>
        )
      }
    }
}

export default HikeInfo;
