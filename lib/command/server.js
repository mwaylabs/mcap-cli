/**
 * Created by pascalbrewing on 01/10/14
 *
 */

"use strict";
var serverconfig = require('mcaprc');
var chalk = require('chalk');

/**
 * switch server command
 * @param program
 */
function server(program) {
    switch ( program.server ) {
        case 'add':
            var addTask = require('./server/add');
            return addTask(program);
            break;
        case 'default':
            var defaultTask = require('./server/default');
            return defaultTask.createDefault(program);
            break;
        case 'remove':
            var removeTask = require('./server/remove');
            return removeTask(program);
            break;
        case 'list':
            var listTask = require('./server/behavior');
            return listTask(serverconfig.list());
            break;
        default:
            var helperTask = require('./server/help');
            return helperTask();
            break;
    }
}

module.exports = server;
