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
        var addTask = require('./server/add');
        addTask(args);
        break;
      case 'default':
        var defaultTask = require('./server/default');
        defaultTask.createDefault(args);
        break;
      case 'remove':
        var removeTask = require('./server/remove');
        removeTask(args);
        break;
      case 'list':
        var listTask = require('./server/behavior');
        listTask.displayTable(serverconfig.list());
        break;
      default:
        var helperTask = require('./server/help');
        helperTask();
        break;
    }
}
module.exports = server;
