/*
 * mct-core
 * https://github.com/mwaylabs/mct-core
 *
 * Copyright (c) 2014 M-Way Solutions GmbH
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var log = require('../../log');
var generatorPath = require('./generator-path.js');

/**
 * A wrapper around yo. Use it to access the generator.
 */
var Yo = function() {};

// Wrap yeoman run method for simplify unit tests.
// https://github.com/mwaylabs/mct-core/blob/aa9906447c23a5c92fff555864beefc4f27c4f8a/test/project_create_test.js#L61
Yo.prototype._run = function(generator, opts, cb) {
  return this._env.run(generator, opts, cb);
};

/**
 * Execute yeoman with the given options
 *
 * @param  {Array}    args    Args related to yeoman args https://github.com/yeoman/environment/blob/5b96dc84934a0785f832941a2ca49806b697d566/lib/environment.js#L40
 * @param  {Object}   options Configuration for the yeoman exectuion, see example.
 * @param  {Function} cb
 *
 * @example
 * yo.run(['mcap'], {
 *  // Yeoman options https://github.com/yeoman/environment/blob/5b96dc84934a0785f832941a2ca49806b697d566/lib/environment.js#L40
 *  opts: {
 *  	"skip-install": true
 *  },
 *  // Restore the cwd after execution
 *  restoreCwd: true
 * })
 */
Yo.prototype.run = function(args, options, cb) {

  var previousWorkingDirectory;

  if (typeof options.opts === 'function') {
    options.opts = options.opts();
  }

  // Set default yeoman options
  options.opts = options.opts || {};
  options.opts['skip-install'] = true;
  options.opts['skip-welcome-message'] = true;

  var generatorName = args;
  if (Array.isArray(generatorName)) {
    generatorName = generatorName[0];
  }

  // If the generatorName contains a double point the
  // string in front of it is the main generator and
  // the string after is the sub generator.
  //
  // E.g. mcap:model
  // 'mcap' is the main generator https://github.com/mwaylabs/generator-mcap/blob/master/app/index.js
  // 'model' is the sub generator from mcap https://github.com/mwaylabs/generator-mcap/blob/master/model/index.js
  generatorName = generatorName.split(':')[0];

  log.debug('Run generator %s', generatorName);

  // Change directory so yeoman can do his job.
  var cwd = generatorPath.basePath(generatorName);
  if (cwd) {
    log.debug('Change directory to %s', cwd);
    previousWorkingDirectory = process.cwd();
    process.chdir(cwd);
  }

  // Run yeoman
  var generatorInstance = this._run(args, options.opts, function(err) {
    if (err) {
      return cb(err);
    }
    if (previousWorkingDirectory && options.restoreCwd !== false) {
      process.chdir(previousWorkingDirectory);
    }
    cb(null, generatorInstance);
  });
};

Yo.prototype.lookup = function (cb) {

  this._env = require('yeoman-environment').createEnv();
  this._env.on('error', function (err) {
    log.debug('error %s', err.message);
    cb(err);
  });

  // Override the core yeoman methode to get
  // only local installed generators
  this._env.getNpmPaths = function() {
    return [path.resolve(__dirname, '../../node_modules')];
  };

  // Search for local generators
  this._env.lookup(cb);
};

module.exports = Yo;
