'use strict';

var fullname = require('fullname');
var _ = require('lodash');

<<<<<<< HEAD
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
  name: 'Server',
  value: {
    method: '_server'
=======
var menuEntries = [
  {
    name: 'Create a new project',
    value: {
      method: '_createProject'
    }
  },
  {
    name: 'Server',
    value: {
      method: '_server'
    }
  },
  {
    name: 'Deploy',
    value: {
      method: '_deploy'
    }
  },
  {
    name: 'Find some help',
    value: {
      method: '_findHelp'
    }
  },
  {
    name: 'Get me out of here!',
    value: {
      method: '_exit'
    }
>>>>>>> 42db0c9... add deploy to mcap cmd, fix  wron default
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

    var allo = name ? ('\'Hi ' + name.split(' ')[0] + '! ') : '\'Hi! ';

    this.prompt([{
      name: 'whatNext',
      type: 'list',
      message: allo + 'What would you like to do?',
      choices: getMenuEntries(this._isProject)
    }], function (answer) {
      this[answer.whatNext.method](done);
    }.bind(this));
  }.bind(this));
};
