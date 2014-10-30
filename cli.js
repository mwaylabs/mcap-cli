#!/usr/bin/env node

'use strict';

var path = require('path');
var _ = require('lodash');
var nopt = require('nopt');
var eventBus = require('./lib/util/eventbus.js');
var commands = require('./lib/commands');

var options = {
  debug: true
};

var opts = nopt();
var args = opts.argv.remain;
var cmd = args.shift();

if (!cmd) {

  // Register the `home generator.
  var env = require('yeoman-environment').createEnv();
  env.on('end', function () {
    console.log('Done running sir');
  });

  env.on('error', function (err) {
    console.error('Error', process.argv.slice(2).join(' '), '\n');
    console.error(options.debug ? err.stack : err.message);
  });

  env.lookup(function() {
    env.register(path.resolve(__dirname, './cli-menu'), 'menu');
    env.run(['menu'], {});
  });

} else {

  // cli is called with a short hand like `mcap new`
  var data = {
    cmd: cmd,
    args: opts.argv.remain,
    opts: _.omit(opts, 'argv')
  };

  // Setup the commands and register the listiners
  commands();
  eventBus.emit(eventBus.CMD_EVENT, data);
}
