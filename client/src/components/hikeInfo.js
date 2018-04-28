import React from 'react';
import './hikeInfo.css'
import  FaEdit  from 'react-icons/lib/fa/edit';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export class HikeInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      oldInfo: [],
      editMode:false,
      route:[],
      coordinates:[],

      edittitle:0,
      editlength:0,
      editlat:0,
      editlng:0,
      editelevation:0,
      editduration:'',
      editdifficulty:'',
      editisLoop: '',
      editdescription:'',
      edithasSameStartFinish:'',
      editendLat:'',
      editendLng:'',
      edithasRivercrossing: '',
      editdriveHasRivercrossing:'',
      editgpsRouteFileName:'',
      gpsRouteFileUrl:'',
    };
    this.downloadGpsRoute = this.downloadGpsRoute.bind(this);
    this.handleIconClicked = this.handleIconClicked.bind(this);
    this.loadRouteOnMap = this.loadRouteOnMap.bind(this);
  }

  handleIconClicked(name){
    console.log(name)
  }

  closeInfo(){
    this.props.setSelectedMarker(null);
  }

  suggestAnEdit(){
    var oldEdit = !this.state.editMode;
    this.setState({editMode:oldEdit})
    console.log(this.state.editMode)

    this.setState({oldInfo:this.props.info})
  }


  loadRouteOnMap(fileName){
    fetch('/api/getRoute:' + fileName)
      .then(res => res.json())
      .then(route => this.setState({route}, () =>  {
        console.log(route);
        var coordinates = route.features[0].geometry.coordinates;
        this.setState({coordinates});
        // this.props.showRoute(coordinates);
        this.props.showRoute(route);
       }
    ));
  }



  downloadGpsRoute(fileName){
    console.log(fileName);
    var path = 'http://localhost:5000/downloadGpsRoute:' + fileName;
    //thetta downloadar leidinni
    if(window){
      window.open(path);
    }
   }

   sendEdit(){
     if(this.state.gpsRouteUrl !== ""){
       console.log('sending route', this.state.gpsRouteUrl);
       const data = new FormData();
       data.append('selectedFile',this.state.gpsRouteUrl);
       axios.post('/gpsroutes', data).then((res) => {
         console.log(res);
       })
     }

     var sendData = {
       title:this.state.oldInfo.title,
       length:parseInt(this.state.oldInfo.length, 10),
       lat:this.state.oldInfo.lat,
       lng:this.state.oldInfo.lng,
       elevation:parseInt(this.state.oldInfo.elevation, 10),
       duration:this.state.oldInfo.duration,
       difficulty:this.state.oldInfo.difficulty,
       description:this.state.oldInfo.description,
       isLoop: this.state.oldInfo.isLoop,
       hasSameStartFinish: this.state.oldInfo.hasSameStartFinish,
       endLat:this.state.oldInfo.endLat,
       endLng:this.state.oldInfo.endLng,
       hasRivercrossing: this.state.oldInfo.hasRivercrossing,
       driveHasRivercrossing:this.state.oldInfo.driveHasRivercrossing,
       gpsRouteFileName:this.state.oldInfo.gpsRouteFileName,

       edittitle:this.state.edittitle,
       editlength:this.state.editlength,
       editlat:this.state.editlat,
       editlng:this.state.editlng,
       editelevation:this.state.editelevation,
       editduration:this.state.editduration,
       editdifficulty:this.state.editdifficulty,
       editisLoop: this.state.editisLoop,
       editdescription:this.state.editdesciption,
       edithasSameStartFinish:this.state.edithasSameStartFinish,
       editendLat:this.state.editendLat,
       editendLng:this.state.editendLng,
       edithasRivercrossing: this.state.edithasRivercrossing,
       editdriveHasRivercrossing:this.state.editdriveHasRivercrossing,
       editgpsRouteFileName:this.state.editgpsRouteFileName,
       gpsRouteFileUrl:this.state.gpsRouteFileUrl,

     };
      // fetch('http://localhost:5000/api/addEdit', {
      fetch('http://icelandichikes.com/api/addEdits', {
     method: 'POST',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(sendData)
   }).then((res) => {
     console.log('res', res);
     console.log('success')
     toast.success("Thank You For Your edit Submission! It will be reviewed and then added to the database!", {
       position: toast.POSITION.TOP_CENTER
     });
     document.getElementById('file-input').value = '';

   }).catch((err) => {
     console.log('err',err)
     toast.error('An Error occurred', {
       position:toast.POSITION.TOP_CENTER
     })
   });
   }

   //select routes with file selector
     selectHikeFile(event){
       event.preventDefault();
       console.log(event.target.value);
       // var value = event.target.value;
       var files = event.target.files[0];

       console.log(files)
       //check if file extension is correct
       var ext = files.name.substring(files.name.length-3, files.name.length);
       console.log(ext);
       if(ext === 'kml' || ext === "gpx"){
         var gpsRouteUrl = files;
         this.setState({gpsRouteUrl});
         var gpsRouteFileName = files.name;
         this.setState({editgpsRouteFileName:gpsRouteFileName})
       } else {
         toast.error('Your file must be one of the formats, .gpx, .kml', {
           position: toast.POSITION.TOP_CENTER
         });
         event.target.value = "";
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
              <li>
                Hike is a loop
                {this.state.editMode ? <a onClick={() => this.handleIconClicked('isLoop')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : ''}
              </li>
            ) : (
              <div>
              <li>
                Hike is not a loop
                {this.state.editMode ? <a onClick={() => this.handleIconClicked('isLoop')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : ''}
              </li>
              {HasSameStartFinish}
              </div>
            )


            const gpsRoutes = info.gpsRouteFileName && info.gpsRouteFileName !== "" ? (
              <li> GPS routes
                <div>
                  <button onClick={() => this.loadRouteOnMap(info.gpsRouteFileName)}>
                    Show Route on map.
                  </button>
                  <br />
                  <p>
                    You can also download the gps route and open it with your smart phone in a app such as Geo Tracker.
                    You will have  a more detailed desciption of the hike and it (should) work offline.
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

            // const editIconStyle = {
            //   float: "right",
            //   margin: "3px",
            // }
            //
            // const editIcon = this.state.editMode ? ((props) =>
            //   <a style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a>
            // ) : (
            //   <span />
            // )



            const addGpsRoute = this.state.editMode && ( !info.gpsRouteFileName || info.gpsRouteFileName === "") ? (
              <li>
                <label className="info">
                  Upload the hike route, the formats possible are .gpx and .kml
                </label>
                <input
                  id="file-input"
                  type="file"
                  name="gpsHikeURL"
                  onChange={this.selectHikeFile.bind(this)}
                />
                </li>
            ) : (
              <span />
            )

//ATH nuna er edit ekki virkt, bara haegt ad baeta vid gps routes
        return (
          <div className="hike-info" onClick={this.props.toggleSideNav}>
            <h1 className="hike-info-title">{info.title}</h1>
            <button className="close-hike-info" onClick={this.closeInfo.bind(this)}>X</button>
            <ul>
              <li className="description">
                {this.state.editMode && false ? <a onClick={() => this.handleIconClicked('description')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : '' }
                {info.description}
              </li>
              <li>
                Difficulty is {info.difficulty}
                {this.state.editMode && false ? <a onClick={() => this.handleIconClicked('difficulty')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : ''}
              </li>
              <li>
                Length is {info.length} meters
                {this.state.editMode && false ? <a onClick={() => this.handleIconClicked('length')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : ''}
              </li>
              <li>
                Duration is {info.duration}
                {this.state.editMode && false ? <a onClick={() => this.handleIconClicked('duration')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : ''}
              </li>
              <li>
                Elevation is {info.elevation} meters
                {this.state.editMode && false ? <a onClick={() => this.handleIconClicked('elevation')} style={{color:"black", cursor:'pointer'}}><FaEdit style={{float:"right"}} /></a> : ''}
              </li>
              {IsLoop}

              {addGpsRoute}
            </ul>
            {this.state.editMode ?
              <button onClick={this.sendEdit.bind(this)}>
                Send Edit
              </button>
              : ''
            }
            {gpsRoutes}
            {!info.gpsRouteFileName || info.gpsRouteFileName === "" ?
            <button onClick={this.suggestAnEdit.bind(this)}>
              {!this.state.editMode ? "Add gps route" : "Cancel"}
            </button> :''
          }
          <ToastContainer />
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
