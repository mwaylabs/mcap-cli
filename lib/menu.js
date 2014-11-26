'use strict';

var util = require('util');
var debug = require('debug')('mway:mcap-cli:menu');
var chalk = require('chalk');
var gen = require('yeoman-generator');
var eventBus = require('./util/eventbus.js');
var mctCore = require('mct-core');
var mcaprc = require('mcaprc');

var availableCommands = 'home new server help deploy component'.split(' ');

// The `menu` generator provides users with a few common, helpful commands.
var Generator = module.exports = function () {
  gen.Base.apply(this, arguments);

  var cmd = this.args[0];
  if (!cmd) {
    cmd = 'home';
  }

  if (availableCommands.indexOf(cmd) === -1) {
    return console.log(chalk.red('Unknow command'), cmd);
  }

  eventBus.on('CMD_EVENT_HOME', this._home.bind(this));
  eventBus.on('CMD_EVENT_NEW', this._new.bind(this));
  eventBus.on('CMD_EVENT_SERVER', this._server.bind(this));
  eventBus.on('CMD_EVENT_HELP', this._findHelp.bind(this));
  eventBus.on('CMD_EVENT_COMPONENT', this._component.bind(this));
  eventBus.on('CMD_EVENT_DEPLOY', this._deploy.bind(this));

  var eventName = util.format('%s_%s', eventBus.CMD_EVENT, cmd.toUpperCase());
  debug('emit event with name %s', eventName);
  eventBus.emit(eventName);
};

util.inherits(Generator, gen.Base);

Generator.prototype._isProject = mctCore.checker.isValidProject();

Generator.prototype._requireProject = function() {
  if (!mctCore.checker.isValidProject()) {
    console.log(chalk.red('This command is only available in a mCAP project directory.'));
    process.exit(1);
  }
};

Generator.prototype._notRequireProject = function() {
  if (mctCore.checker.isValidProject()) {
    console.log(chalk.red('This command is NOT available in a mCAP project directory.'));
    process.exit(1);
  }
};

Generator.prototype._requireServerConfig = function() {
  var serverList = mcaprc.list();
  if (!serverList || Object.keys(serverList.server).length === 0) {
    console.log(chalk.red('This command requires a server configuration.'));
    console.log(chalk.grey('Please run ') + '\'mcap server add\'' + chalk.grey(' to add a server configuraton.'));
    process.exit(1);
  }
};

Generator.prototype._server = require('./commands/server');

// Display the home screen
Generator.prototype._home = require('./commands/home');

// Display the new create project prompts
Generator.prototype._new = require('./commands/new');

// Display the create component prompts
Generator.prototype._component = require('./commands/component');

// Prompts user with a few helpful resources, then opens it in their browser.
Generator.prototype._findHelp = require('./commands/help');

//deploy the app to the mcap
Generator.prototype._deploy = require('./commands/deploy');

// Exit
Generator.prototype._exit = function () {};

Generator.prototype._api = require('./util/api-caller.js');
