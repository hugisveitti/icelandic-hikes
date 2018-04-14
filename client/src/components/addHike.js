import React from 'react';
import './addHike.css'

import { ToastContainer, toast } from 'react-toastify';



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
      changingStartPoint:false,
      notificationSystem:null,
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
    if(this.state.changingStartPoint){
      this.setState({lat:pos.lat,lng:pos.lng});
    } else if(this.state.changingEndPoint) {
      this.setState({endLat:pos.lat, endLng:pos.lng});
    }
  }


  changeEndPoint(event){
    if(this.state.changingEndPoint){
      this.setState({changingEndPoint:false})
      this.props.setChangingEndLatLng(false);
    } else {
      this.setState({changingEndPoint: true})
      this.props.setChangingEndLatLng(true);
    }
    if(this.state.changingStartPoint){
      this.setState({changingStartPoint: false});
      this.props.setChangingStartLatLng(false);
    }
    event.preventDefault();
  }

//ytt a change start point med marker
  changeStartPoint(event){
    if(this.state.changingStartPoint){
      this.setState({changingStartPoint: false})
      this.props.setChangingStartLatLng(false);
    } else {
      this.setState({changingStartPoint:true})
      this.props.setChangingStartLatLng(true);
    }

    if(this.state.changingEndPoint){
      this.setState({changingEndPoint: false});
      this.props.setChangingEndLatLng(false);
    }
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
        console.log('submitted')
        var sendData = {
          title:this.state.title,
          length:parseInt(this.state.length),
          lat:this.state.lat,
          lng:this.state.lng,
          elevation:parseInt(this.state.elevation),
          duration:this.state.duration,
          difficulty:this.state.difficulty,
          description:this.state.description,
          isLoop: this.state.isLoop,
          hasSameStartFinish: this.state.hasSameStartFinish,
          endLat:this.state.endLat,
          endLng:this.state.endLng,
        };
        fetch('http://localhost:5000/api/addHikes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData)
      }).then((res) => {
        console.log('res', res);
        console.log('success')
        toast.success("Thank You For Your Submission! It will be reviewed and then added to the database!", {
          position: toast.POSITION.TOP_CENTER
        });
        this.setState({title:''})
        this.clearInputs();
      }).catch((err) => {
        console.log('err',err)

      });
    } else {

      toast.error("You Have To Fill Out All The Forms.", {
        position: toast.POSITION.TOP_CENTER
      });

    }
  }



  render(){
    console.log(this.state)

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
          <div className="hike">
            <label className="title">
              Name of the Hike
            </label>
              <label>
                <input placeholder="Name of Hike" type="text" name="title" title={this.state.title} onChange={this.handleChange} />
              </label>
          </div>


          <div className="hike">
            <label className="info">
              The starting point of the hike can either be typed in or marked with the map.
            </label>
            <label>
              <input placeholder="Longitude" type="text" name="lng" value={this.state.lng !== 0 ? this.state.lng : ''} onChange={this.handleChange} />
            </label>
            <label>
              <input placeholder="Latitude" type="text" name="lat" value={this.state.lat !== 0 ? this.state.lat : ''} onChange={this.handleChange} />
            </label>
            <button onClick={this.changeStartPoint.bind(this)} style={this.state.changingStartPoint ? {background: "#697487", color:"white"} : {color:"black"}}>
              Change Start point by clicking map
            </button>
            <label className="info">
              Is the hike a loop?
              <div onChange={this.setIsLoop.bind(this)}>
                <br />
                <input type="radio" value="true" name="isLoop" /> Yes
                <input type="radio" value="false" name="isLoop" /> No
              </div>
            </label>
              {notLoop}
              {showEndLatLng}

          </div>

          <div className="hike">
            <label className="info">
              The length should be in meters and only typed in numbers.
            </label>
            <label>
              <input placeholder="length" type="text" name="length" value={this.state.length > 0 ? this.state.length : ''} onChange={this.handleChange} />
            </label>
          </div>

          <div className="hike">
            <label className="info">
              The elevation should be in meters and only typed in numbers.
            </label>
            <label>
              <input placeholder="Elevation" type="text" name="elevation" value={this.state.elevation> 0 ? this.state.elevation : ''} onChange={this.handleChange} />
            </label>
          </div>

          <div className="hike">
            <label className="info">
              The Duration can be written in minutes or hours, and can be both in numbers and letters.
            </label>
            <label>
            <input placeholder="Duration" type="text" name="duration" value={this.state.duration} onChange={this.handleChange} />
            </label>
          </div>

          <div className="hike">
            <label className="info">
              Please select the difficulty of the hike.
            </label>
            <label>
            Difficulty:
            <select name="difficulty" value={this.state.value} onChange={this.handleChange}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
              </select>
            </label>
          </div>

          <div className="hike">
            <label className="info">
              Write a good desctiption of the hike. Please write the way to get to the beginning of the hike.
            </label>
            <label>
              <textarea placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
            </label>
          </div>

          <button className="submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
          <ToastContainer />
      </div>
    )
  }
}


export default AddHike;
