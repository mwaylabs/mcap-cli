'use strict';

var fullname = require('fullname');
var _ = require('lodash');
var mctCore = require('mct-core');

var menuEntries = [{
  name: 'Create a new project',
  value: {
    method: '_new'
  }
}, {
  name: 'Add a new component',
  value: {
    method: '_component'
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

module.exports = function () {
  var done = this.async();

  var isValidProject = mctCore.checker.isValidProject();

  // Remove menu item 'Add a new component'
  // if we are not in a mcap project.
  if (!isValidProject) {
    menuEntries = _.filter(menuEntries, function(item) {
      return item.value.method !== '_component';
    });
  }

  fullname(function (err, name) {
    if (err) {
      done(err);
      return;
    }

    var allo = name ? ('\'Hi ' + name.split(' ')[0] + '! ') : '\'Hi! ';

    this.prompt([{
      name: 'whatNext',
      type: 'list',
      message: allo + 'What would you like to do?',
      choices: menuEntries
    }], function (answer) {
      this[answer.whatNext.method](done);
    }.bind(this));
  }.bind(this));
};
