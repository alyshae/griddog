/******************************
 *   SERVER SIDE JAVASCRIPT   *
 ******************************/


/********************
 *  SETUP & CONFIG  *
 ********************/

//require express
var express = require('express');

//generate a new express app and call it 'app'
var app = express();

//require bodyParser
var bodyParser = require('body-parser');

//serve static files in public
app.use(express.static('public'));

//body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

/**************
 *   ROUTES   *
 **************/

//HTML End-points

app.get('/', function(req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

//JSON End-points (actions)

//get all scores
app.get('/scores', function(req, res) {
  res.json(scores);
});



/******************************
 *  HEROKU & EXPRESS SERVERS  *
 ******************************/
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server for GridDog listening at  http://localhost:3000/');
});
