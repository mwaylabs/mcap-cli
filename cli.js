#!/usr/bin/env node

'use strict';

var path = require('path');
var env = require('yeoman-environment').createEnv();
var nopt = require('nopt');
var mctCore = require('mct-core');

var opts = nopt();
var args = opts.argv.remain;
var cmd = args.shift();
var server = require('./commands/server');
var options = {
  debug: true
};

env.on('end', function () {
  console.log('Done running sir');
});

env.on('error', function (err) {
  console.error('Error', process.argv.slice(2).join(' '), '\n');
  console.error(options.debug ? err.stack : err.message);
});

env.lookup(function () {
  if (!cmd) {
    env.register(path.resolve(__dirname, './cli-menu'), 'menu');
    env.run(['menu'], {});
  }

  if(cmd === 'server'){
    server(args);
  }

  if (cmd === 'new') {
    var options = {};
    if (args[0]) {
      options.name = args[0];
    }
    mctCore.createProject.run(options);
  }

});
