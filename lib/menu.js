'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var log = require('mcap-log');
var chalk = require('chalk');
var gen = require('yeoman-generator');
var eventBus = require('./util/eventbus.js');
var mctCore = require('mct-core');
var mcaprc = require('mcaprc');

var availableCommands = 'home new server help deploy component logger'.split(' ');

// The `menu` generator provides users with a few common, helpful commands.
var Generator = module.exports = function (args, opts) {
  gen.Base.apply(this, arguments);

  var cmd = this.args[0];
  if (!cmd) {
    cmd = 'home';
  }

  // Check if the command is available otherwise
  // print a nice message to the user
  if (availableCommands.indexOf(cmd) === -1) {
    console.log(chalk.red('Unknow command ' + cmd));
    return console.log(chalk.yellow('Run \'mcap --help\' to see all available commands'));
  }

  // Register bus events
  eventBus.on('CMD_EVENT_HOME', this._home.bind(this));
  eventBus.on('CMD_EVENT_NEW', this._new.bind(this));
  eventBus.on('CMD_EVENT_SERVER', this._server.bind(this));
  eventBus.on('CMD_EVENT_HELP', this._findHelp.bind(this));
  eventBus.on('CMD_EVENT_COMPONENT', this._component.bind(this));
  eventBus.on('CMD_EVENT_DEPLOY', this._deploy.bind(this));
  eventBus.on('CMD_EVENT_LOGGER', this._logger.bind(this));

  // Build event name with the current command name
  var eventName = util.format('%s_%s', eventBus.CMD_EVENT, cmd.toUpperCase());

  if (opts.version) {
    // Print out cli version
    var pkg = require('../package.json');
    return console.log(pkg.name + ' ' + pkg.version);
  }

  if (opts.help) {
    // Skip here to prevent execution of the main menu
    return;
  }

  log.debug('emit event with name %s', eventName);
  eventBus.emit(eventName);
};

util.inherits(Generator, gen.Base);

// Override original yeoman help implemnation
// so we can print our custom help
Generator.prototype.help = function() {
  return fs.readFileSync(path.resolve(__dirname, '../USAGE'), 'utf8');
};

Generator.prototype.printhelp = function() {
  return console.log(this.help());
};

// Stop the programm if cwd is outside a mCAP project
Generator.prototype._requireProject = function() {
  if (!mctCore.checker.isValidProject()) {
    console.log(chalk.red('This command is only available in a mCAP project directory.'));
    process.exit(1);
  }
};

// Stop the programm if cwd is inside a mCAP project
Generator.prototype._notRequireProject = function() {
  if (mctCore.checker.isValidProject()) {
    console.log(chalk.red('This command is NOT available in a mCAP project directory.'));
    process.exit(1);
  }
};

// Stop the programm if no server is configured by the user.
Generator.prototype._requireServerConfig = function() {
  var serverList = mcaprc.list();
  if (!serverList || Object.keys(serverList.server).length === 0) {
    console.log(chalk.red('This command requires a server configuration.'));
    console.log(chalk.grey('Please run ') + '\'mcap server add\'' + chalk.grey(' to add a server configuraton.'));
    process.exit(1);
  }
};

// Add mixings
Generator.prototype._server = require('./commands/server');
Generator.prototype._home = require('./commands/home');
Generator.prototype._new = require('./commands/new');
Generator.prototype._component = require('./commands/component');
Generator.prototype._findHelp = require('./commands/help');
Generator.prototype._deploy = require('./commands/deploy');
Generator.prototype._logger = require('./commands/logger');

// Exit
Generator.prototype._exit = function () {};
