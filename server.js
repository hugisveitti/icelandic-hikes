//node server

const express = require('express');

//fa og senda JSON
var bodyParser = require('body-parser');

const app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });


const firebase = require('firebase');


var fireApp = firebase.initializeApp({
    apiKey: "AIzaSyAYbeYGXH_QfOf6-JKOnfn-Doib9QujuMs",
    authDomain: "hikes-1523233761876.firebaseapp.com",
    databaseURL: "https://hikes-1523233761876.firebaseio.com",
    projectId: "hikes-1523233761876",
    storageBucket: "",
    messagingSenderId: "929699427823"
})



//get data from firebase
var database = firebase.database();

var ref = database.ref('Hike')
ref.on("value", function(data){
  //console.log(data);
  var output = data.val();
  var hikesInfo = [];
  var keys = Object.keys(output);
  for(var i=0; i<keys.length; i++){
    var k = keys[i];

    var title = k;
    var lng = output[k].lng;
    var lat = output[k].lat;
    var length = output[k].length;
    var elevation = output[k].elevation;
    var difficulty = output[k].difficulty;
    var duration = output[k].duration;
    var description = output[k].description
    //var info = [title, lng, lat, length, elevation, difficulty, duration];
    hikesInfo.push({title: title, pos:{lng:lng, lat:lat}, length :length, elevation:elevation, difficulty:difficulty, duration:duration, description:description})
  }
  console.log(hikesInfo);

  app.get('/api/hikes', (req, res) => {
    res.json(hikesInfo);
    console.log('data sent')
  })
  console.log('fin')
},function(err){
  console.log(err)
})

// app.get('/api/addHikes', (req, res ) =>{
//   console.log('gotten addhikes')
//   console.log(req.body)
//   res.send('komid ven')
// })

app.post('/api/addHikes', (req, res) => {
  console.log("succa")
  console.log(req.body)
  res.send('takk fyrir sumbit veeenur')
})

app.get('/', (req,res) => {
  res.send('yomomma');
})

//nota express til ad senda a map.js
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);

app.use('/', router);
