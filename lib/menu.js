'use strict';

var util = require('util');
var debug = require('debug')('mway:mcap-cli:menu');
var gen = require('yeoman-generator');
var eventBus = require('./util/eventbus.js');

// The `menu` generator provides users with a few common, helpful commands.
var Generator = module.exports = function () {
  gen.Base.apply(this, arguments);

  if (!this.args[0]) {
    this.args[0] = 'home';
  }

  eventBus.on('CMD_EVENT_HOME', this._home.bind(this));
  eventBus.on('CMD_EVENT_NEW', this._new.bind(this));
  eventBus.on('CMD_EVENT_SERVER', this._server.bind(this));
  eventBus.on('CMD_EVENT_HELP', this._findHelp.bind(this));
  eventBus.on('CMD_EVENT_COMPONENT', this._component.bind(this));

  var eventName = util.format('%s_%s', eventBus.CMD_EVENT, this.args[0].toUpperCase());
  debug('emit event with name %s', eventName);
  eventBus.emit(eventName);
};

util.inherits(Generator, gen.Base);

Generator.prototype._server = require('./commands/server');

// Display the home screen
Generator.prototype._home = require('./commands/home');

// Display the new create project prompts
Generator.prototype._new = require('./commands/new');

// Display the create component prompts
Generator.prototype._component = require('./commands/component');

// Prompts user with a few helpful resources, then opens it in their browser.
Generator.prototype._findHelp = require('./commands/help');

// Exit
Generator.prototype._exit = function () {};

Generator.prototype._api = require('./util/api-caller.js');
