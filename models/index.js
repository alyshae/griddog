// SERVER-SIDE JAVASCRIPT

//require express
var express = require('express');

// generate a new express app and call it 'app'
var app = express();

//require bodyParser
var bodyParser = require('body-parser');

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
