import React from 'react';
import './addHike.css'
//https://www.npmjs.com/package/react-notifications
import {NotificationManager} from 'react-notifications';


export class AddHike extends React.Component {
  constructor(){
    super();
    this.state = {
      title:"",
      length:0,
      lat:0,
      lng:0,
      elevation:0,
      duration:'',
      difficulty:'easy',
      description:'',
      isLoop: true,
      hasSameStartFinish: true,
      endLat:0,
      endLng:0,
      changingEndPoint:false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const name = event.target.name;
    this.setState({[name]: event.target.value})
  }

  setIsLoop(event){
      if(event.target.value === "true"){
        this.state.isLoop = true;
        this.setState({isLoop: true, hasSameStartFinish: true})
      } else {
        this.setState({isLoop:false})
      }
  }

  setHasSameStartFinish(event){
    if(event.target.value === "true"){
      this.setState({hasSameStartFinish: true});
    } else {
      this.setState({hasSameStartFinish:false});
    }
  }

  getPos(pos){
    console.log(this.props.newMarkerPos.lng);
    if(!this.state.changingEndPoint){
      this.setState({lat:pos.lat,lng:pos.lng});
    } else {
      this.setState({endLat:pos.lat, endLng:pos.lng});
    }
  }

  changeEndPoint(event){
    this.setState({changingEndPoint:!this.state.changingEndPoint})
    console.log(this.state.changingEndPoint)
    event.preventDefault();
  }

  clearInputs(){
    this.setState({
      title:"",
      length:0,
      lat:0,
      lng:0,
      elevation:0,
      duration:'',
      difficulty:'easy',
      description:'',
      endLat:0,
      endLng:0,
    })
  }

  //thegear ytt er a sumbit takkann kallad a firebaseio
  handleSubmit(event){
      console.log('submit')
      event.preventDefault();
      console.log(this.state)
    if(this.state.title !== "" && this.state.length > 0 && this.state.duration !== '' ){
        console.log('filled form')
        fetch('http://localhost:5000/api/addHikes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state)
      }).then(function(res) {
        console.log('res', res);
        console.log('success')
        NotificationManager.success('Thanks', 'Thank you for your contribution',3000);
        this.clearInputs();
      }).catch(function(err){
        console.log('err',err)
        NotificationManager.error("Error", 'There has been an error')
      });
    } else {
      NotificationManager.success('You have to fill out all the forms.','Error',3000)
      console.log('not filled form');

    }
  }



  render(){

    const notLoop = !this.state.isLoop ? (
      <label>
        Dose the hike start and end at the same place?
        <div onChange={this.setHasSameStartFinish.bind(this)} >
          <br />
          <input type="radio" value="true" name="hasSameStartFinish" /> Yes
          <input type="radio" value="false" name="hasSameStartFinish" /> No
        </div>
      </label>
    ):(
      <span></span>
    );

    const showEndLatLng = !this.state.hasSameStartFinish ? (
      <div>
        <label>
          <input placeholder="End Longitude" type="text" name="endLng" value={this.state.endLng !== 0 ? this.state.endLng : ''} onChange={this.handleChange} />
        </label>
        <label>
          <input placeholder="End Latitude" type="text" name="endLat" value={this.state.endLat !== 0 ? this.state.endLat : ''} onChange={this.handleChange} />
        </label>
        <button onClick={this.changeEndPoint.bind(this)} style={this.state.changingEndPoint ? {background: "#697487", color:"white"} : {color:"black"}}>
          Change End point by clicking map
        </button>
      </div>
    ) : (
      <span></span>
    );

    return (
      <div className="add-hike-container">
        <form>
          <label>
            <input placeholder="Name of Hike" type="text" name="title" title={this.state.title} onChange={this.handleChange} />
          </label>
          <label>
            <input  placeholder="length" type="text" name="length" value={this.state.length > 0 ? this.state.length : ''} onChange={this.handleChange} />
            <span value={this.state.length > 0 ? 'meters': ''}></span>
          </label>
          <label>
            <input placeholder="Longitude" type="text" name="lng" value={this.state.lng !== 0 ? this.state.lng : ''} onChange={this.handleChange} />
          </label>
          <label>
            <input placeholder="Latitude" type="text" name="lat" value={this.state.lat !== 0 ? this.state.lat : ''} onChange={this.handleChange} />
          </label>
          <label>
            You can add Lat and Lng by clicking the map.
          </label>
          <label>
            Is the hike a loop?
            <div onChange={this.setIsLoop.bind(this)}>
              <br />
              <input type="radio" value="true" name="isLoop" /> Yes
              <input type="radio" value="false" name="isLoop" /> No
            </div>
          </label>
            {notLoop}
            {showEndLatLng}
          <label>
          <input placeholder="Elevation" type="text" name="elevation" value={this.state.elevation> 0 ? this.state.elevation : ''} onChange={this.handleChange} />
          </label>
          <label>
          <input placeholder="Duration" type="text" name="duration" value={this.state.duration} onChange={this.handleChange} />
          </label>
          <label>
          Difficulty:
          <select name="difficulty" value={this.state.value} onChange={this.handleChange}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
            </select>
          </label>
          <label>
          <textarea placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
          </label>
          <button onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    )
  }
}


export default AddHike;
