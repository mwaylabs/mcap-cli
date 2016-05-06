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
    // https://github.com/mwaylabs/generator-mcap/blob/28cd71fde5e9c935a757a498f384b9a7f6c2b8f1/model/index.js
    yo.run('mcap:model', {}, function(err, generator) {
      if (err) {
        return cb(err);
      }
      // Retrieve entered prompt values from the generator-mcap
      var parentValues = generator.prepareValues();
      var command  = ['m-server:bikini', parentValues.name];
      /**
       * set the primary key if is set
       */
      _.each(parentValues.attributes, function (index) {
        if (index.key) {
          return command.push(index.name);
        }
      });
      // Run the bikini sub generator from the generator-m-server
      // https://github.com/mwaylabs/generator-m-server/blob/2094aaadb2042c2cbb81358165474e5a50a96df9/bikini/index.js
      yo.run(command, {}, cb);
    });
  });
};
