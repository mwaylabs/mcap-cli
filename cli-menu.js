'use strict';

var util = require('util');
var gen = require('yeoman-generator');
var opn = require('opn');
var fullname = require('fullname');
var mctCore = require('mct-core');

// The `menu` generator provides users with a few common, helpful commands.
var Generator = module.exports = function () {
  gen.Base.apply(this, arguments);
};

util.inherits(Generator, gen.Base);

// I'm sorry...
Generator.prototype._noop = function () {};

// Prompts user with a few helpful resources, then opens it in their browser.
Generator.prototype._findHelp = function () {
  this.prompt([{
    name: 'whereTo',
    type: 'list',
    message:
      'Here are a few helpful resources.\n' +
      '\nI will open the link you select in your browser for you',
    choices: [{
      name: 'Take me to the documentation',
      value: 'https://wiki.mwaysolutions.com/confluence/display/mCAP/Home'
    }, {
      name: 'File an issue on GitHub',
      value: 'http://github.com/mwaylabs/mcap-cli'
    }, {
      name: 'Take me back home',
      value: {
        method: 'home'
      }
    }]
  }], function (answer) {

    if (this._.isFunction(this[answer.whereTo.method])) {
      this[answer.whereTo.method](answer.whereTo.args);
    } else {
      opn(answer.whereTo);
    }
  }.bind(this));
};

Generator.prototype._createProject = function () {
  mctCore.createProject.run();
};

// Display the home screen
Generator.prototype.home = function (options) {
  var done = this.async();

  options = options || {};

  var defaultChoices = [{
    name: 'Create a new project',
    value: {
      method: '_createProject'
    }
  }, {
    name: 'Find some help',
    value: {
      method: '_findHelp'
    }
  }, {
    name: 'Get me out of here!',
    value: {
      method: '_noop'
    }
  }];

  fullname(function (err, name) {
    if (err) {
      done(err);
      return;
    }

    var allo = name ? ('\'Allo ' + name.split(' ')[0] + '! ') : '\'Allo! ';

    this.prompt([{
      name: 'whatNext',
      type: 'list',
      message: allo + 'What would you like to do?',
      choices: this._.flatten([
        defaultChoices
      ])
    }], function (answer) {
      this[answer.whatNext.method](answer.whatNext.args, done);
    }.bind(this));
  }.bind(this));
};
