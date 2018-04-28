const fs = require('fs');
//node server

//fyrir storage
const multer = require('multer');

const express = require('express');

//fa og senda JSON
var bodyParser = require('body-parser');

const iplocation = require('iplocation');


const tj = require('togeojson');
const DOMParser = require('xmldom').DOMParser;

const app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header("Access-Control-Allow-Origin", "http://icelandichikes.com");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
 });

var hit = 0;
const firebase = require('firebase');


var fireApp = firebase.initializeApp({
    apiKey: "AIzaSyAYbeYGXH_QfOf6-JKOnfn-Doib9QujuMs",
    authDomain: "hikes-1523233761876.firebaseapp.com",
    databaseURL: "https://hikes-1523233761876.firebaseio.com",
    projectId: "hikes-1523233761876",
    storageBucket: "",
    messagingSenderId: "929699427823"
})



const storage = multer.diskStorage({
  destination: (req,file, cb) => {
     cb(null, './gpsroutes');
   },
  filename(req, file, cb) {
    cb(null, `${file.originalname}`);
  },
})


const upload = multer({storage});
app.post('/gpsroutes', upload.single('selectedFile'), (req, res) => {
  const file = req.file;
  const meta = req.body;
  console.log('gps routes post')
  res.send();
})

//fyrir ad downloada routes,
app.get('/downloadGpsRoute:id', (req, res) => {
  var id = req.params.id;
  var fileName = id.substring(1,id.length);
  var path = (__dirname + '/gpsroutes/' + fileName);
  res.download(path, file, (err) => {
    if(err){
      console.log(err);
    }
  })
})


//get data from firebase
var database = firebase.database();
var ref = database.ref('Hike');
ref.on("value", function(data){
  var output = data.val();
  var hikesInfo = [];
  var keys = Object.keys(output);
  for(var i=0; i<keys.length; i++){
    var k = keys[i];
    var title = output[k].title;
    var lng = output[k].lng;
    var lat = output[k].lat;
    var length = output[k].length;
    var elevation = output[k].elevation;
    var difficulty = output[k].difficulty;
    var duration = output[k].duration;
    var description = output[k].description;
    var isLoop = output[k].isLoop;
    var hasSameStartFinish = output[k].hasSameStartFinish;
    var endLat = output[k].endLat;
    var endLng = output[k].endLng;
    var pointsOnHike = output[k].pointsOnHike;
    var gpsRouteFileName = output[k].gpsRouteFileName;
    hikesInfo.push({
      key:k,
      title: title,
      pos:{lng:lng, lat:lat},
      length :length,
      elevation:elevation,
      difficulty:difficulty,
      duration:duration,
      description:description,
      isLoop:isLoop,
      hasSameStartFinish:hasSameStartFinish,
      endLat:endLat,
      endLng:endLng,
      pointsOnHike:pointsOnHike,
      gpsRouteFileName:gpsRouteFileName,
    });
  }
  // console.log(hikesInfo);

  app.get('/api/hikes', (req, res) => {
    res.json(hikesInfo);

  fs.readFile('tracker-log.json', (err, data) => {
    if(err){console.log(err)}
    else {
       var obj = [];
      if(data[0]){
        obj = JSON.parse(data);
      }
      var hit = 1;
      if(obj[0]){
        hit = obj[obj.length-1].hit;
        hit++;
      }
      var ip2 = req.headers['x-forwarded-for'];
      var ip = req.connection.remoteAddress;

      var country = '';

      iplocation(String(ip2), (error, rs) => {
        console.log(rs);
         country = rs.country_name;
        var date = String(new Date());
        var newData = {ip:ip,ip2:ip2,hit:hit, date: date, country:country};
        obj.push(newData);
        var json = JSON.stringify(obj);
        fs.writeFile('tracker-log.json',json);
      });
      }
    })
  })
},function(err){
    console.log(err)
  })

app.get('/api/getRoute:id', (req, res) => {
  var route = {pos:'jelllllo'}
  var id = req.params.id;
  var fileName = id.substring(1, id.length);
  console.log(id);
  console.log(fileName);
  var path = __dirname + '/gpsRoutes/' + fileName;
  var ext = fileName.substring(fileName.length-3, fileName.length);
  console.log(ext);
  console.log(path);

  if(ext === 'gpx'){
    var gpx = new DOMParser().parseFromString(fs.readFileSync(path, 'utf8'));
    var converted = tj.gpx(gpx);
    var convertedWithStyles = tj.gpx(gpx, {styles: true});
    res.json(convertedWithStyles)
  } else if(ext === 'kml'){
    var kml = new DOMParser().parseFromString(fs.readFileSync(path, 'utf8'));
    var converted = tj.kml(kml);
    var convertedWithStyles = tj.kml(kml, {styles: true});
    res.json(convertedWithStyles)
  }
})

//add contribution values to firebase
app.post('/api/addHikes', (req, res) => {
  console.log("succa")
  console.log(req.body)
  var newData = req.body;
  //res.send('takk fyrir sumbit veeenur')
  var ref = database.ref('NewHikes');
  ref.push(newData);
  res.send('takk');
})

app.post('/api/addEdit', (req, res) => {
  console.log('edit success')
  var editData = req.body;
  var ref = database.ref('EditHikes');
  ref.push(editData);
  res.send('takk')
})

// app.get('/', (req,res) => {
//   res.send('yo momma')
// })

//nota express til ad senda a map.js
const port = 5000;
app.listen(port, () => `Server running on port ${port}`);

 app.use('/', router);

 module.exports = router;
