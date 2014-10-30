/**
 * Created by pascalbrewing on 01/10/14
 *
 */
'use strict';

var serverconfig = require('mcaprc');

module.exports = function () {

  var cb = function(value) {
    if (value === 'list') {
      var listTask = require('./behavior');
      listTask.displayTable(serverconfig.list());

    } else if (value === 'default') {
      var defaultTask = require('./default');
      defaultTask.createDefault();

    } else if (value === '_home') {
      this[value]();

    } else {
      require('./' + value)();
    }
  };

  if (this.args[1]) {
    return cb(this.args[1]);
  }

  this.prompt([{
    name: 'whatNext',
    type: 'list',
    message: 'What you want to do?',
    choices: [{
      name: 'Add a new server',
      value: 'add'
    }, {
      name: 'Remove a server',
      value: 'remove'
    }, {
      name: 'List a all server',
      value: 'list'
    }, {
      name: 'Set default server',
      value: 'default'
    }, {
      name: 'Take me back home',
      value: '_home'
    }]
  }], function (answer) {
    cb(answer.whatNext);
  }.bind(this));
};
