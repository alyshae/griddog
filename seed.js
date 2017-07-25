var db = require("./models");
var Score = db.Score;

var scoreList = [
  {
    name: "Aly",
    highScore: 100
  },
  {
    name: "Aly2",
    highScore: 100
  },
  {
    name: "Aly3",
    highScore: 100
  }
];

Score.remove({}, function(err, scores) {
  Score.create(scoreList, function(err, score) {
    if (err) {
      return console.log("error seeding: ", err);
    }
    console.log("created new scores list");
    process.exit();
  });
});
