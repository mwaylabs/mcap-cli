'use strict';

var _ = require('lodash');
var mctCore = require('../../core');

var api = {};

api.model = function() {
  mctCore.model.create();
};

api.connection = function() {
  mctCore.connection.create();
};

var menuEntries = [{
  name: 'Model',
  value: 'model'
}, {
  name: 'Rest Connection',
  value: 'connection'
}, {
  name: 'Take me back home',
  value: {
    method: '_home'
  }
}];

module.exports = function () {

  this._requireProject();

  // Delegate shorthand like `mcap component model`
  // to the target function.
  if (this.args[1]) {
    return api[this.args[1]]();
  }

  this.prompt([{
    name: 'whatNext',
    type: 'list',
    message: 'Which component would you like to add?',
    choices: menuEntries
  }], function (answer) {

    if (_.isFunction(api[answer.whatNext])) {
      // Call methode from the api object
      api[answer.whatNext]();
    } else {
      // Return the user back to home
      this[answer.whatNext.method]();
    }

  }.bind(this));
};
