'use strict';

var _ = require('lodash');
var mctCore = require('mct-core');

var api = {};

api.model = function() {
  mctCore.model.create();
};

var menuEntries = [{
  name: 'Model',
  value: 'model'
}, {
  name: 'Take me back home',
  value: {
    method: '_home'
  }
}];

module.exports = function () {

  if (this.args[1]) {
    return api[this.args[1]]();
  }

  this.prompt([{
    name: 'whatNext',
    type: 'list',
    message: 'Which compontent would you like to add?',
    choices: menuEntries
  }], function (answer) {

    if (_.isFunction(api[answer.whatNext])) {
      api[answer.whatNext]();
    } else {
      this[answer.whatNext.method]();
    }

  }.bind(this));
};
