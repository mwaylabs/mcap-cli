'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var bar = require('progress-bar');
var mcaprc = require('mcaprc');
var log = require('mcap-log');
var mctCore = require('mct-core');

/**
 * return the default server from the json file
 * @returns {*}
 */
var getServer = function (args) {
  if ( args.length > 1 ) {
    return mcaprc.get(args[ 1 ]);
  } else {
    return mcaprc.get(mcaprc.default_server);
  }
};

/*
 *
 * @returns {process.stdout}
 */
var getProcessBar = function () {
  var _bar = bar.create(process.stdout);
  _bar.format = '$bar; $percentage,2:0;% uploaded.';
  _bar.symbols.loaded = chalk.cyan('#');
  _bar.symbols.notLoaded = chalk.red('-');
  _bar.width = 50;
  return _bar;
};

/**
 *
 * @returns {{
 *  name: string,
 *  value: string
 * }[]}
 */
var getChoice = function () {
  var choices = [
    {
      name : 'Deploy to default',
      value: 'default_server'
    }
  ];
  var servers = mcaprc.list();
  _.each(servers.server, function (server, key) {
    if ( key !== servers.default_server ) {
      choices.push(
        {
          name : 'Deploy to ' + key,
          value: key
        }
      );
    }
  });
  return choices;
};

var validationErrorPrinter = function(err) {
  _.each(err.details, function(info) {
    console.log('\n' + chalk.underline(info.file));
    console.log(chalk.red(info.message));
  });
};

/**
 * deploy application
 */
var deploy = function (args) {
  var _bar = getProcessBar();
  var config = getServer(args);
  if (!config) {
    return console.log(chalk.red('There is not server configuration for ' + args[1]));
  }

  config.rootPath = process.cwd();
  config.progress = function (percent) {
    _bar.update(percent / 100);
    if ( percent >= 100 ) {
      console.log('\nInitialize application...');
    }
  };
  var deploy = mctCore.deploy(config);
  deploy.on('data', console.log);
  deploy.on('error', function(err) {
    if (err.name === 'LintError' || err.name === 'ValidateError') {
      return validationErrorPrinter(err);
    }
    log.error(err.body || err);
  });
  deploy.on('complete', function(data) {
    console.log(chalk.green('Your application is now available!'));

    if (data.client) {
      console.log(chalk.gray('Client:'), chalk.underline(data.client));
    }
    if (data.server) {
      console.log(chalk.gray('API:'), chalk.underline(data.server));
    }
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
    return deploy(args);
  }

  this.prompt(
    [
      {
        name: 'deployServer',
        type: 'list',
        message: 'Please choose a Server where you want to deploy?',
        choices: choices
      }
    ],
    function (answer) {
      if ( answer.deployServer !== 'default_server' ) {
        args = [ 'deploy', answer.deployServer ];
      } else {
        args = [ 'deploy' ];
      }
      deploy(args);
    }.bind(this));

};
