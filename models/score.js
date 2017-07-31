let mongoose = require("mongoose"), Schema = mongoose.Schema;

let ScoreSchema = new Schema(
  {
    name: String,
    highScore: Number
  }
);

let Score = mongoose.model("Score", ScoreSchema);
module.exports = Score;
