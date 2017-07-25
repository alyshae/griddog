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
 *    DATA    *
 **************/
var db = require("./models");
var Score = db.Score;



/**************
 *   ROUTES   *
 **************/

//HTML End-points

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

//JSON End-points (actions)

//index: get all scores
app.get('/scores', function index(req, res) {
  Score.find(function(err, scores) {
    if (err) {
      return console.log("index error: " + err);
    }
    res.json(scores);
  });
});



/******************************
 *  HEROKU & EXPRESS SERVERS  *
 ******************************/
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server for GridDog listening at  http://localhost:3000/');
});
