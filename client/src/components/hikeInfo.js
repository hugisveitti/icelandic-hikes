import React from 'react';
import './hikeInfo.css'

export class HikeInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      info: []
    };
  }

  closeInfo(){
    this.props.setSelectedMarker(null);
  }

  suggestAnEdit(){

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
