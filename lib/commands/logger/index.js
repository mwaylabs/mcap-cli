'use strict';
var _ = require('lodash');
var path = require('path');
var chalk = require('chalk');
var mcaprc = require('mcaprc');
var log = require('mcap-log');
var mctCore = require('mct-core');

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
var logger = function (serverAlias) {
  var config = mcaprc.get(serverAlias);
  if (!config) {
    return console.log(chalk.red('There is not server configuration for ' + serverAlias));
  }

  // Get mcap.json content
  var rootPath = mctCore.checker.getProjectRoot(process.cwd());
  var mainifest = require(path.join(rootPath, 'mcap.json'));

  // Specify the logger target app
  config.appUUID = mainifest.uuid;

  mctCore.logger(config, function(err) {
    if (err) {
      return log.error(err);
    }
    log.info('Start logging on %s for application %s', serverAlias, mainifest.name);
  });
};

module.exports = function () {
  var args = this.args;

  this._requireServerConfig();

  var choices = getChoice();
  if (choices.length === 1) {
    args[1] = choices[0].value;
  }

  if (args.length === 2) {
    return logger(args[1]);
  }

  this.prompt(
    [
      {
        name: 'selectedServer',
        type: 'list',
        message: 'Please choose a Server where you want start the logger',
        choices: choices
      }
    ],
    function (answer) {
      logger(answer.selectedServer);
    }.bind(this));

};
