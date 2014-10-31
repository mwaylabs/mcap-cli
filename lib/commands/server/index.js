/**
 * Created by pascalbrewing on 01/10/14
 *
 */
'use strict';

var _ = require('lodash');
var serverconfig = require('mcaprc');
var eventBus = require('../../util/eventbus.js');

var menuItems = [{
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
}];

module.exports = function () {

  var cb = function(value) {
    if (value === 'list') {
      var listTask = require('./behavior');
      listTask.displayTable(serverconfig.list());

    } else if (value === 'default') {
      var defaultTask = require('./default');
      defaultTask.createDefault();

    } else if (value === '_home') {
      eventBus.emit('CMD_EVENT_HOME');

    } else {
      require('./' + value)();
    }
  };

  if (this.args[1]) {
    return cb(this.args[1]);
  }

  // Remove menu item 'Set default server'
  // when less than 2 servers are present
  if (Object.keys(serverconfig.list().server).length < 2) {
    menuItems = _.filter(menuItems, function(item) {
      return item.value !== 'default';
    });
  }

  this.prompt([{
    name: 'whatNext',
    type: 'list',
    message: 'What you want to do?',
    choices: menuItems
  }], function (answer) {
    cb(answer.whatNext);
  }.bind(this));
};
