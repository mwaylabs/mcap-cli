/**
 * Created by pascalbrewing on 01/10/14
 *
 */
'use strict';
var serverconfig = require('mcaprc');
/**
 * switch server command
 * @param {object} args
 */
function server(args) {
  switch ( args[0] ) {
    case 'add':
      var addTask = require('./add');
      addTask(args);
      break;
    case 'default':
      var defaultTask = require('./default');
      defaultTask.createDefault(args);
      break;
    case 'remove':
      var removeTask = require('./remove');
      removeTask(args);
      break;
    case 'list':
      var listTask = require('./behavior');
      listTask.displayTable(serverconfig.list());
      break;
    default:
      var helperTask = require('./help');
      helperTask();
      break;
  }
}

module.exports = function(data) {
  if (data.cmd === 'server') {
    server(data.args||[]);
  }
};

