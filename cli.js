#!/usr/bin/env node

'use strict';

var path = require('path');
var nopt = require('nopt');
var menuPath = path.resolve(__dirname, './lib/menu.js');
var options = {
  debug: true
};

var opts = nopt();
var args = opts.argv.remain;

// Register the home generator.
var env = require('yeoman-environment').createEnv();
env.on('end', function () {
  console.log('Done running sir');
});

// Catch errors from triggerd by home generator
env.on('error', function (err) {
  console.error('Error', process.argv.slice(2).join(' '), '\n');
  console.error(options.debug ? err.stack : err.message);
});

env.lookup(function() {

  // Register home generator

  env.register(menuPath, 'menu');

  // Add the generator name so yeoman knows what we want to do.
  args.unshift('menu');

  // Start the generator
  env.run(args, opts);
});
