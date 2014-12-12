'use strict';

var mctCore = require('mct-core');
var chalk = require('chalk');
var log = require('mcap-log');

/**
 * Create a new project
 */
module.exports = function() {
  var options = {};

  // Make sure that cwd is not inside a project
  this._notRequireProject();

  // Pass the name from the args
  if (this.args[1]) {
    options.name = this.args[1];
  }

  if (typeof this.options['skip-install'] !== 'undefined') {
    options.skipInstall = this.options['skip-install'];
  }

  mctCore.project.create(options, function(err, projectSummary) {
    if (err) {
      return log.error(err);
    }

    if (projectSummary.basePath) {
      log.info( ' Please \'cd\' into ' + chalk.gray(projectSummary.basePath));
    }
  });
};
