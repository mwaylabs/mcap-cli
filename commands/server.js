/**
 * Created by pascalbrewing on 01/10/14
 *
 */
'use strict';
var serverconfig = require('mcaprc');
/**
 * switch server command
 * @param {object} program
 */
function server(program) {
  console.log('args', program);
  if(program.length > 0){
    switch ( program[0] ) {
      case 'add':
        var addTask = require('./server/add');
        addTask(program);
        break;
      case 'default':
        var defaultTask = require('./server/default');
        defaultTask.createDefault(program);
        break;
      case 'remove':
        var removeTask = require('./server/remove');
        removeTask(program);
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
}
module.exports = server;
