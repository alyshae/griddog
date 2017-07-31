//////****     mongoose docs imply use of "var" rather than "let"     ****//////

let mongoose = require("mongoose");
let promise = mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/griddog", {
  useMongoClient: true
});

//require & export the score model through index.js
module.exports.Score = require("./score.js");
