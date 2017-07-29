var db = require("./models");
var Score = db.Score;

var scoreList = [
  {
    name: "Aly",
    highScore: 0
  },
  {
    name: "Aly2",
    highScore: 0
  },
  {
    name: "Aly3",
    highScore: 0
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
