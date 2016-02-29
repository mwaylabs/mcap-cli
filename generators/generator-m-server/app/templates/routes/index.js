'use strict';

var express = require('express');
var app = express();

// Send a simple text response
app.get('/', function(req, res) {
  res.send('Hello from mCAP');
});

module.exports = app;
