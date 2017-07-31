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
app.use(express.static(__dirname + '/public'));

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
app.get('/scores', function(req, res) {
  Score.find(function(err, scores) {
    if (err) {
      return console.log("index error: " + err);
    }
    console.log(scores + " server.js line 50");
    res.json(scores);
  });
});

//create: post new score
app.post('/scores', function(req, res) {
  // create new score with form data (`req.body`)
  console.log('new score created: ', req.body);
  let newScore = new Score(req.body);
  newScore.save(function handleScoreSave(err, savedScore) {
    if (err) {
      res.sendStatus(500);
      console.log('error creating new score in server.js: ' + err)
    }
    res.json(savedScore);
  });
});


/******************************
 *  HEROKU & EXPRESS SERVERS  *
 ******************************/
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server for GridDog listening at  http://localhost:3000/');
});
