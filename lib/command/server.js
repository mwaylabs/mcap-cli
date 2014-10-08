/**
 * Created by pascalbrewing on 01/10/14
 *
 */

"use strict";
var serverconfig = require('mcaprc');

/**
 * switch server command
 * @param {object} program
 */
function server(program) {
    switch ( program.server ) {
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
            listTask(serverconfig.list());
            break;
        default:
            var helperTask = require('./server/help');
            helperTask();
            break;
    }
}

module.exports = server;
