//////****     mongoose docs imply use of "var" rather than "let"     ****//////

var mongoose = require("mongoose");
var promise = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/griddog", {
  useMongoClient: true
});
//removed ";" on line 5 above

//require & export the score model through index.js
module.exports.Score = require("./score.js");
