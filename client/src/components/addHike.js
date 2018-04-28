import React from 'react';
import './addHike.css'

import { ToastContainer, toast } from 'react-toastify';

//fyrir file upload a node serverinn
import axios from 'axios';


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
      startMarker:{
        lat:0,
        lng:0,
        title:'Start of hike',
        key:-1
      },
      endMarker:{
        lat:0,
        lng:0,
        hike:'End of hike',
        key:-2
      },
      endLat:0,
      endLng:0,
      changingEndPoint:false,
      changingStartPoint:false,
      notificationSystem:null,
      hasRivercrossing:false,
      driveHasRivercrossing:false,
      pointsOnHike:[],
      userName:'',
      gpsRouteUrl:'',
      gpsRouteFileName:'',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
  }


  handleChange(event){
    const name = event.target.name;
    this.setState({[name]: event.target.value})
  }

  handleChangeNumber(event){
    const value = event.target.value;
    const name = event.target.name;
    const val = parseInt(value.substring(value.length-1, value.length), 10);
    const valStr = value.substring(value.length-1, value.length);
//verduer ad vera svona svo virki
    if(val || valStr === "0" || valStr ===""){
      this.setState({[name]: value})
    } else {
      toast.error("To change the " + name + " you can only type numbers.", {
        //TODO breyta thannig taost kemur ekki ef annad toast er
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  setBool(event){
    if(event.target.value === "true"){
      this.setState({[event.target.name]:true})
    } else {
      this.setState({[event.target.name]:false})
    }
  }

  setIsLoop(event){
      if(event.target.value === "true"){
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

//slokkva a ollum points
    var pointsOnHike = this.state.pointsOnHike;
    for(var i=0; i<pointsOnHike.length; i++){
      pointsOnHike[i].changingPos = false;
    }
    this.setState({pointsOnHike});
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

    //slokkva a ollum points
        var pointsOnHike = this.state.pointsOnHike;
        for(var i=0; i<pointsOnHike.length; i++){
          pointsOnHike[i].changingPos = false;
        }
        this.setState({pointsOnHike});

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
      pointsOnHike:[],
    })
  }

  //thegear ytt er a sumbit takkann kallad a firebaseio
  handleSubmit(event){
      console.log('submit')
      event.preventDefault();
    // if(this.state.title !== "" && this.state.length > 0 && this.state.duration !== '' ){
    if(this.state.title !== ""){
        console.log('submitted trying')
        //all points have to have lat and lng
        var points = [];
        for(var i=0; i<this.state.pointsOnHike.length; i++){
          if(this.state.pointsOnHike[i].lat !== 0 && this.state.pointsOnHike[i].lng !== 0){
            points.push(this.state.pointsOnHike[i]);
          }
        }

        //send gps rout if there is one
        if(this.state.gpsRouteUrl !== ""){
          console.log('sending route', this.state.gpsRouteUrl);
          const data = new FormData();
          data.append('selectedFile',this.state.gpsRouteUrl);
          axios.post('/gpsroutes', data).then((res) => {
            console.log(res);
          })
        }

        var sendData = {
          title:this.state.title,
          length:parseInt(this.state.length, 10),
          lat:this.state.lat,
          lng:this.state.lng,
          elevation:parseInt(this.state.elevation, 10),
          duration:this.state.duration,
          difficulty:this.state.difficulty,
          description:this.state.description,
          isLoop: this.state.isLoop,
          hasSameStartFinish: this.state.hasSameStartFinish,
          endLat:this.state.endLat,
          endLng:this.state.endLng,
          hasRivercrossing: this.state.hasRivercrossing,
          driveHasRivercrossing:this.state.driveHasRivercrossing,
          pointsOnHike:points,
          userName:this.state.userName,
          gpsRouteFileName:this.state.gpsRouteFileName
        };
         // fetch('http://localhost:5000/api/addHikes', {
         fetch('http://icelandichikes.com/api/addHikes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData)
      }).then((res) => {
        toast.success("Thank You For Your Submission! It will be reviewed and then added to the database!", {
          position: toast.POSITION.TOP_CENTER
        });
        this.setState({title:''})
        this.clearInputs();
      }).catch((err) => {
        console.log('err',err)
        toast.error('An Error occurred', {
          position:toast.POSITION.TOP_CENTER
        })
      });
    } else {

      toast.error("You Have To Fill Out All The Forms.", {
        position: toast.POSITION.TOP_CENTER
      });

    }
  }

  handleAddPoint(event){
    event.preventDefault();
    var pointsOnHike = this.state.pointsOnHike;
    var poi = {
      title:'',
      changingPos:false,
      lng:0,
      lat:0,
      info:'',
    }
    pointsOnHike.push(poi);
    this.setState({pointsOnHike});
  }

  changeAddPointValue(point){
    const name = point.target.name;
    const index = point.target.id;
    const value = point.target.value;
    var pointsOnHike = this.state.pointsOnHike;
    if(name === 'title'){
      pointsOnHike[index].title = value;
    } else if(name === 'info'){
      pointsOnHike[index].info = value;
    } else if(name === 'lat'){
      pointsOnHike[index].lat = value;
    } else if(name === 'lng'){
      pointsOnHike[index].lng = value;
    }

    pointsOnHike[index].key = index;

    this.setState({pointsOnHike});
  }

//ef thad er verid ad baeta vid points og valid er ad baeta vid point med marker og yta a mappid
  changePointPos(point){
    var oldChange = this.state.pointsOnHike[point.target.id].changingPos;
    point.preventDefault();
    var pointsOnHike = this.state.pointsOnHike;
    for(var i=0; i<pointsOnHike.length; i++){
      pointsOnHike[i].changingPos = false;
    }
    this.props.setChangingStartLatLng(false);
    this.props.setChangingEndLatLng(false);

    //slokkva a hinum tokkunum
    this.setState({changingEndPoint:false, changingStartPoint:false})
    pointsOnHike[point.target.id].key = point.target.id;
    pointsOnHike[point.target.id].changingPos = !oldChange;
    this.setState({pointsOnHike})
  }


//draggable marker gerir hann selected
  makeSelectedMarker(marker){
    var pointsOnHike = this.state.pointsOnHike;
    for(var i=0; i<pointsOnHike.length; i++){
      pointsOnHike[i].changingPos = false;
    }
    this.props.setChangingStartLatLng(false);
    this.props.setChangingEndLatLng(false);

    for(var j=0; j<pointsOnHike.length; j++){
      if(pointsOnHike[j].key === marker.key ){
        pointsOnHike[j].changingPos = true;
      }
    }
    this.setState({pointsOnHike});
  }

//param er stadsetningin sem ytt var a a mappinu
  getMarker(param){
    console.log(param)
    var returnMarker;
    if(this.state.addingStartLatLng){
      returnMarker = {
        title:'Start of Hike',
        pos:{
          lng:this.state.lng,
          lat:this.state.lat
        }
      }
    } else if(this.state.addingEndLatLng){
      returnMarker = {
        title:'End of Hike',
        pos:{
          endLng:this.state.lng,
          endLat:this.state.lat
        }
      }
    }else if(this.state.pointsOnHike[0]) {
      var pointsOnHike = this.state.pointsOnHike;
      for(var i=0; i<pointsOnHike.length; i++){
        if(pointsOnHike[i].changingPos){
          returnMarker = this.state.pointsOnHike[i];
          console.log(param.lng)
          console.log(pointsOnHike[i])
          pointsOnHike[i].lng = param.lng;
          pointsOnHike[i].lat = param.lat;
          this.setState({pointsOnHike})
        }
      }
    }
    return returnMarker;
  }

//select routes with file selector
  selectHikeFile(event){
    event.preventDefault();
    // var value = event.target.value;
    var files = event.target.files[0];

    //check if file extension is correct
    var ext = files.name.substring(files.name.length-3, files.name.length);
    if(ext === 'kml' || ext === "gpx"){
      var gpsRouteUrl = files;
      this.setState({gpsRouteUrl});
      var gpsRouteFileName = files.name;
      this.setState({gpsRouteFileName})
    } else {
      toast.error('Your file must be one of the formats, .gpx, .kml', {
        position: toast.POSITION.TOP_CENTER
      });
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

//adding points of interest to the hike or some kind of path
    const AddPoint = this.state.pointsOnHike.map((point, index) =>
      <div className="addHike-point" key={index}>
        <input
          type="text"
          className="input-point"
          placeholder="Title"
          value={point.title}
          name="title"
          onChange={this.changeAddPointValue.bind(this)}
          id={index}
          />
          <br />
          <br />
            <input className="point-pos" id={index} placeholder="Longitude" type="text" name="lng" value={point.lng !== 0 ? point.lng : ''} onChange={this.changeAddPointValue.bind(this)} />
            <input className="point-pos" id={index} placeholder="Latitude" type="text" name="lat" value={point.lat !== 0 ? point.lat : ''} onChange={this.changeAddPointValue.bind(this)} />
          <button id={index} onClick={this.changePointPos.bind(this)} style={point.changingPos ? {background: "#697487", color:"white"} : {color:"black"}}>
            Change point by clicking map
          </button>

          <textarea
            className="input-point"
            placeholder="Information"
            value={point.info}
            name="info"
            onChange={this.changeAddPointValue.bind(this)}
            id={index}
          />
      </div>
    );


    return (
      <div className="add-hike-container">
        <form>
          <div className="hike">
            <label className="info">
              If you want to add a hike to the database, please fill in the appropriate information.
              Thank you for your help!
            </label>
          </div>
          <div className="hike">
            <label className="title">
              Name of the Hike
            </label>
              <label>
                <input placeholder="Name of Hike" type="text" name="title" value={this.state.title} onChange={this.handleChange} />
              </label>
          </div>
          <div className="hike">
            <label className="info">
              The starting point of the hike can either be typed in or marked with the map.
            </label>
            <label>
              <input placeholder="Longitude" type="text" name="lng" value={this.state.lng !== 0 ? this.state.lng : ''} onChange={this.handleChangeNumber} />
            </label>
            <label>
              <input placeholder="Latitude" type="text" name="lat" value={this.state.lat !== 0 ? this.state.lat : ''} onChange={this.handleChangeNumber} />
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
              <input placeholder="length" type="text" name="length" value={this.state.length > 0 ? this.state.length : ''} onChange={this.handleChangeNumber} />
            </label>
          </div>

          <div className="hike">
            <label className="info">
              The elevation should be in meters and only typed in numbers.
            </label>
            <label>
              <input placeholder="Elevation" type="text" name="elevation" value={this.state.elevation> 0 ? this.state.elevation : ''} onChange={this.handleChangeNumber} />
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
              Are there any river crossings during the hike?
              <div onChange={this.setBool.bind(this)}>
                <br />
                <input type="radio" value="true" name="hasRivercrossing" /> Yes
                <input type="radio" value="false" name="hasRivercrossing" /> No
              </div>
            </label>
          </div>

          <div className="hike">
            <label className="info">
              Are there any river crossings during the drive to get to the hike?
              <div onChange={this.setBool.bind(this)}>
                <br />
                <input type="radio" value="true" name="driveHasRivercrossing" /> Yes
                <input type="radio" value="false" name="driveHasRivercrossing" /> No
              </div>
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

          <div className="hike">
            <label className="info">
              Add points on the hike and write some information about the point, either a point of interest or top of mountain.
               The point can also be just a random point on the way.
            </label>
            {AddPoint}
            <button onClick={this.handleAddPoint.bind(this)}>
              Add Point
            </button>
          </div>

          <div className="hike">
            <label className="info">
              Upload the hike route, the formats possible are .gpx and .kml
            </label>
            <input
              id="file-input"
              type="file"
              name="gpsHikeURL"
              onChange={this.selectHikeFile.bind(this)}
            />
          </div>

          <div className="hike">
            <label className="info">
              Write your name if you want to be credited your submission.
            </label>
            <label>
              <input
                type="text"
                placeholder="Your name"
                 name="userName"
                 value={this.state.userName}
                 onChange={this.handleChange}
              />
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
