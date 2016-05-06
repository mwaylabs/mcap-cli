'use strict';

var express = require('express');
var app = express();

// lists all available API.
app.get('/', function( req, res ) {
  res.json(app.routes);
});

module.exports = app;
