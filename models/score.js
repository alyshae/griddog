var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  name: String,
  highScore: Number
});

var Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;
