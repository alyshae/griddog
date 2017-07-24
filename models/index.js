var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/griddog");

//require & export the score model through index.js
module.exports.Score = require("./score.js");
