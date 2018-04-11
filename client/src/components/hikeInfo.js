import React, { Component } from 'react';
import Map from './map';

export class HikeInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      info: []
    };
  }


    render(){
      const info = this.props.info;
      if(info.title){
        return (
          <div>
            <h1>{info.title}</h1>
            <ul>
              <li>Difficulty is {info.difficulty}</li>
              <li>Length is {info.length} meters</li>
              <li>Duration is {info.duration}</li>
              <li>Elevation is {info.elevation} meters</li>
              <li>Description: {info.description}</li>
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
