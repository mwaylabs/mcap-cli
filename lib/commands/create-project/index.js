'use strict';

var mctCore = require('mct-core');

/**
 * Create a new project
 *
 * @constructor
 * @param {Object} data
 * @property {String}  cmd - The incoming command
 * @property {Array}  args - Options to pass the instance
 * @property {Object}  opts - Arguments to pass the instance
 */
module.exports = function(data) {
  var options = {};

  if (data.cmd === 'new') {
    if (data.args[0]) {
      options.name = data.args[0];
    }
    mctCore.createProject.run(options);
  }
};
