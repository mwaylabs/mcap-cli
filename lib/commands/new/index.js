'use strict';

var mctCore = require('mct-core');
var chalk = require('chalk');

/**
 * Create a new project
 */
module.exports = function() {
  var options = {};

  if (this.args[1]) {
    options.name = this.args[1];
  }

  if (typeof this.options['skip-install'] !== 'undefined') {
    options.skipInstall = this.options['skip-install'];
  }

  mctCore.project.create(options, function(err, projectSummary) {
    if (projectSummary.basePath) {
      console.log( ' Please \'cd\' into ' + chalk.gray(projectSummary.basePath));
    }
  });
};
