/*
 * mct-core
 * https://github.com/mwaylabs/mct-core
 *
 * Copyright (c) 2014 M-Way Solutions GmbH
 * Licensed under the MIT license.
 */

'use strict';

var log = require('../../log');
var assert = require('assert');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var spawn = require('cross-spawn');

/**
 * Helper to execute gulp
 *
 * @param {String} dir Path to the projects root directory
 */
var GulpUtil = function(dir) {
  this.spawnCommand = spawn;
  this.workingDir = dir;
};

util.inherits(GulpUtil, EventEmitter);

var removeLastLineBreak = function(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

GulpUtil.prototype._run = function(location) {
  var args = Array.prototype.slice.call(arguments, 1);
  args = args.concat(['--no-color']);

  var baseDir = path.join(this.workingDir, location);
  var gulpPath = path.join(baseDir, 'node_modules', 'gulp', 'bin', 'gulp.js');
  log.debug('Gulp bin path: %s', gulpPath);

  // Change dir so gulp can do his job.
  process.chdir(baseDir);

  // Create a child process
  var cp = this.spawnCommand(gulpPath, args);
  cp.stdout.setEncoding('utf8');
  cp.stderr.setEncoding('utf8');

  // Listen for output from the child process
  cp.stdout.on('data', function (data) {
    data = removeLastLineBreak(data);
    log.debug('stdout %s', data);
    this.emit('data', data);
  }.bind(this));

  // Listen for output from the child process
  cp.stderr.on('data', function (data) {
    data = removeLastLineBreak(data);
    log.debug('stderr %s', data);
    this.emit('error', data);
  }.bind(this));

  cp.on('exit', function (exitCode) {
    // Restore last workin directory
    process.chdir(this.workingDir);

    // If exitCode == 0 gulp was executed successfully
    // If exitCode > 0 Something goes wrong
    log.debug('exitCode %s', exitCode);
    this.emit('exit', exitCode);
  }.bind(this));
};

/**
 * Execute the task in the given location
 *
 * @param  {String} location Can be `server` or `client`
 * @param  {String} taskName The gulp task to execute
 * @return
 */
GulpUtil.prototype.run = function(location, taskName) {
  assert.ok(location, 'A location is required');
  assert.ok(['server', 'client'].indexOf(location) > -1, 'Location must be \'server\' or \'client\'');

  taskName = taskName || 'default';
  this._run(location, taskName);
};

module.exports = GulpUtil;
