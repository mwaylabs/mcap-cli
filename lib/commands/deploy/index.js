'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var bar = require('progress-bar');
var mcaprc = require('mcaprc');
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
      name : 'Deploy Default',
      value: 'default_server'
    }
  ];
  var servers = mcaprc.list();
  _.each(servers.server, function (server, key) {
    if ( key !== servers.default_server ) {
      choices.push(
        {
          name : 'Deploy ' + key,
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
    console.log(chalk.red(err.message || err));
  });
  deploy.on('complete', function(data) {
    console.log(chalk.green('Your application is now available!'));
    console.log(chalk.gray('Client:'), chalk.underline(data.client));
    console.log(chalk.gray('API:'), chalk.underline(data.server));
  });
};

module.exports = function () {
  var args = this.args;
  if ( this.args.length = 1 ) {
    this.prompt(
      [
        {
          name: 'deployServer',
          type: 'list',
          message: 'Plz choose a Server where you want to deploy?',
          choices: getChoice()
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
  } else {
    deploy(args);
  }
};
