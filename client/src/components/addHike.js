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
      description:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const name = event.target.name;
    this.setState({[name]: event.target.value})
    console.log(this.state)
  }

  getPos(pos){
    console.log(this.props.newMarkerPos.lng);
    this.setState({lat:pos.lat,lng:pos.lng});
  }

  //thegear ytt er a sumbit takkann kallad a firebaseio
  handleSubmit(event){
    console.log('submit')
      event.preventDefault();
    if(this.state.title !== ""){
        console.log('filled form')
        fetch('http://localhost:5000/api/addHikes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state)
      }).then(function(res) {
        console.log('res', res.body);
        console.log('success')
        NotificationManager.success('Thanks', 'Thank you for your contribution',3000);
      }).catch(function(err){
        console.log('err',err)
        NotificationManager.error("Error", 'There has been an error')
      });
    } else {
      NotificationManager.success('You have to fill out all the forms.','Error',3000)
      console.log('not filled form')
    }
  }


  render(){
    return (
      <div className="add-hike-container">
        <form onSubmit={this.handleSubmit}>
          <label>
          <span>Name of hike:</span>
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
          <input placeholder="Elevation" type="text" name="elevation" value={this.state.elevation> 0 ? this.state.elevation : ''} onChange={this.handleChange} />
          </label>
          <label>
          <input placeholder="Duration" type="text" name="duration" value={this.state.duration} onChange={this.handleChange} />
          </label>
          <label>
          Difficulty:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
            </select>
          </label>
          <label>
          <textarea placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
          </label>
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}


export default AddHike;
