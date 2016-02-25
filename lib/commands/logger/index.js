'use strict';
var _ = require('lodash');
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var mcaprc = require('../../rc');
var log = require('../../log');
var mctCore = require('../../core');

/**
 *
 * @returns {{
 *  name: string,
 *  value: string
 * }[]}
 */
var getChoice = function () {
  var choices = [];
  var servers = mcaprc.list();
  _.each(servers.server, function (server, key) {
    choices.push(
      {
        name : key,
        value: key
      }
    );
  });
  return choices;
};

/**
 * logger application
 */
var logger = function (serverAlias, loglevel) {
  var config = mcaprc.get(serverAlias);
  if (!config) {
    return console.log(chalk.red('There is not server configuration for ' + serverAlias));
  }

  // Get mcap.json content
  var rootPath = mctCore.checker.getProjectRoot(process.cwd());
  var mainifest = require(path.join(rootPath, 'mcap.json'));

  // Specify the logger target app
  config.appUUID = mainifest.uuid;
  config.loglevel = loglevel;

  mctCore.logger(config, function(err) {
    if (err) {
      return log.error(err);
    }
    var loglevelInfo = '';
    if (config.loglevel) {
      loglevelInfo = util.format('with loglevel %s ', config.loglevel);
    }
    log.info('Start logging %son %s for application %s', loglevelInfo, serverAlias, mainifest.name);
  });
};

module.exports = function () {
  var args = this.args;

  this._requireProject();
  this._requireServerConfig();

  var choices = getChoice();
  if (choices.length === 1) {
    args[1] = choices[0].value;
  }

  if (args.length > 1) {
    return logger(args[1], args[2]);
  }

  // Ask for the target server
  this.prompt([{
      name: 'selectedServer',
      type: 'list',
      message: 'Please choose a Server where you want start the logger',
      choices: choices
    }
  ],
  function (answer) {
    var selectedServer = answer.selectedServer;

    // Ask for log level
    var choices = 'trace debug info warn error fatal'.split(' ');
    this.prompt([{
        name: 'selectedLoglevel',
        type: 'list',
        message: 'Please choose a logger level',
        choices: choices
      }
    ], function(answer) {

      // Start logger
      logger(selectedServer, answer.selectedLoglevel);
    });

  }.bind(this));

};
