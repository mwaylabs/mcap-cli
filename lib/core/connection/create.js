/*
 * mct-core
 * https://github.com/mwaylabs/mct-core
 *
 * Copyright (c) 2014 M-Way Solutions GmbH
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var Yo = require('../util/yo.js');
var checker = require('../util/checker.js');

module.exports = function (cb) {
  cb = _.isFunction(cb) ? cb : function () {};

  var yo = new Yo();

  // Switch to the project root directory to ensure
  // thath every sub generator works find
  var projectRoot = checker.getProjectRoot();
  process.chdir(projectRoot);

  // Search for local generators
  yo.lookup(function() {
    // Run the model sub generator from the generator-mcap
    yo.run('mcap:connection', {}, cb);
  });
};
