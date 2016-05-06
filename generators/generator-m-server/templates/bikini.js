'use strict';

var express = require('express');
var bikini = require('mcap/bikini.js');
var app = express();
app.use(express.bodyParser());

app.use('/', bikini.middleware({
  entity: '<%= appname %>-MetaModelContainer-<%= name %>',
  type: {
    container: '<%= appname %> MetaModelContainer',
    model: '<%= name %>'
  },
  idAttribute: '<%= primaryKey %>'
}));

module.exports = app;
