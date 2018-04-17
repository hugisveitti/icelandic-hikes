import React from 'react';
import './hikeInfo.css'

export class HikeInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      info: []
    };
  }


    render(){
      const info = this.props.info;
      if(info){

          console.log(info.endLng)
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
        return (
          <div className="hike-info">
            <h1>{info.title}</h1>
            <p>
              {info.description}
            </p>
            <ul>
              <li>Difficulty is {info.difficulty}</li>
              <li>Length is {info.length} meters</li>
              <li>Duration is {info.duration}</li>
              <li>Elevation is {info.elevation} meters</li>
              {IsLoop}
            </ul>
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
