/**
 * Created by pascalbrewing on 08/10/14.
 */
'use strict';
var chalk = require('chalk');
var _ = require('lodash');
var figures = require('figures');
var inquirer = require('inquirer');
var serverconfig = require('mcaprc');
var defaultTask = require('./default');
var behavior = require('./behavior');
/**
 * remove All Server
 * @private
 */
function _removeAllServer() {
    var list = serverconfig.list();
    var keys = _.keys(list[ 'server' ]);
    keys.forEach(function (value) {
        serverconfig.remove(value);
    });
    serverconfig.setDefault('n\/a');
    console.log(chalk.bgGreen(chalk.blue(figures.smiley), chalk.white('All Server removed')));
}
/**
 *
 * @param {array} choices
 * @param {string} defaultServerName
 * @private
 */
function _setRemoveCommand(choices, defaultServerName) {

    if ( choices.length > 1 ) {
        choices.push({ 'name': 'all' });
    }
    inquirer.prompt(
        [
            {
                type    : 'checkbox',
                message : 'Select Server/s',
                name    : 'server',
                choices : choices,
                validate: function (answer) {
                    if ( answer.length < 1 ) {
                        return 'You must choose at least one server.';
                    }
                    return true;
                }
            }
        ],
        function (answers) {

            // feature delete all
            if ( _.indexOf(answers.server, 'all') >= 0 ) {
                return _removeAllServer();
            }
            var deleteDefault = false;
            /**
             * @todo remove command only delete single server not a array of server
             */
            if ( answers.server ) {
                answers.server.forEach(function (value) {
                    if ( value === defaultServerName ) {
                        deleteDefault = true;
                    }
                    serverconfig.remove(value);
                });
            }
            if ( deleteDefault ) {
                var server = _.findKey(choices, function (chr) {
                    return chr.name !== defaultServerName;
                });
                defaultTask.setNewDefaultServer(server);
            } else {
                behavior.displayTable(serverconfig.list());
            }
        });
}
/**
 * remove config,default,_ from the server Object
 * @param {object} list
 * @returns {*}
 * @private
 */
function _cleanUpServerList(list) {
    return _.remove(list, function (key) {
        return key !== 'config' && key !== '_' && key !== 'default' ? key : '';
    });
}
/**
 * remove command
 */
function removeServer() {
    var list = serverconfig.list();
    if ( Object.keys(list.server).length <= 0 ) {
        console.log(chalk.blue(figures.info), chalk.green('Your Server list is empty plz use "' + chalk.underline("mcap server add") + '" before'), figures.ellipsis);
        return false;
    }
    var serverKeys = _cleanUpServerList(_.keys(list[ 'server' ]));
    var choices = [];
    serverKeys.forEach(function (value) {
        choices.push({ name: value });
    });
    _setRemoveCommand(choices, list[ serverconfig.default_server ]);
}
module.exports = removeServer;
