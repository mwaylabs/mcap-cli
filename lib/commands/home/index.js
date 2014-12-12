'use strict';

var fullname = require('fullname');
var _ = require('lodash');
var mctCore = require('mct-core');

var menuEntries = [{
  name: 'Create a new project',
  hiddenInProject: true,
  value: {
    method: '_new'
  }
}, {
  name: 'Add a new component',
  hiddenInProject: false,
  value: {
    method: '_component'
  }
}, {
  name: 'Deploy',
  hiddenInProject: false,
  value: {
    method: '_deploy'
  }
}, {
  name: 'Server',
  value: {
    method: '_server'
  }
}, {
  name: 'Find some help',
  value: {
    method: '_findHelp'
  }
}, {
  name: 'Get me out of here!',
  value: {
    method: '_exit'
  }
}];

var getMenuEntries = function(isProject) {
  return _.filter(menuEntries, function(item) {
    return item.hiddenInProject !== isProject;
  });
};

module.exports = function () {
  var done = this.async();

  fullname(function (err, name) {
    if (err) {
      done(err);
      return;
    }

    // Greeting the user
    var allo = name ? ('\'Hi ' + name.split(' ')[0] + '! ') : '\'Hi! ';

    this.prompt([{
      name: 'whatNext',
      type: 'list',
      message: allo + 'What would you like to do?',
      choices: getMenuEntries(mctCore.checker.isValidProject())
    }], function (answer) {
      this[answer.whatNext.method](done);
    }.bind(this));
  }.bind(this));
};
