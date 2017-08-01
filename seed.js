var db = require("./models");
var Score = db.Score;

var scoreList = [
  {
    name: "Bo Obama",
    highScore: 100
  },
  {
    name: "Lassie",
    highScore: 100
  },
  {
    name: "Clifford",
    highScore: 100
  }
];

Score.remove({}, function() {
  Score.create(scoreList, function(err) {
    if (err) {
      return console.log("error seeding: ", err);
    }
    console.log("created new scores list");
    process.exit();
  });
});
