'use strict';

var mctCore = require('mct-core');

/**
 * Create a new project
 */
module.exports = function() {
  var options = {};

  if (this.args && this.args[1]) {
    options.name = this.args[1];
  }
  mctCore.createProject.run(options);
};
