/**
 * Created by pascalbrewing on 08/10/14.
 */
var serverconfig = require('mcaprc');
var chalk = require('chalk');
var _ = require('lodash');
var defaultTask = require('./default');
var inquirer = require('inquirer');
var displayTable = require('./behavior');
/**
 *
 * @param program
 */
function removeServer(program) {
    var list = serverconfig.list();
    var serverKeys = _cleanUpServerList(_.keys(list[ 'server' ]));
    var choices = [];

    serverKeys.forEach(function (value, key) {
        choices.push({ name: value });
    });
    _setRemoveCommand(choices, list[ serverconfig.default_server ]);
}

/**
 *
 * @param choices
 * @param defaultServerName
 * @private
 */
function _setRemoveCommand(choices, defaultServerName) {

    if ( choices.length > 1 ) {
        choices.push({ 'name': 'all' });
    }

    inquirer.prompt(
        [
            {
                type    : "checkbox",
                message : "Select Server/s",
                name    : "server",
                choices : choices,
                validate: function (answer) {
                    if ( answer.length < 1 ) {
                        return "You must choose at least one server.";
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
                })
            }

            if ( deleteDefault ) {
                var server = _.findKey(choices, function (chr) {
                    return chr.name !== defaultServerName;
                });
                defaultTask.setNewDefaultServer(server);
            } else {
                displayTable(serverconfig.list());
            }

        });
}
/**
 * remove config,default,_ from the server Object
 * @param list
 * @returns {*}
 * @private
 */
function _cleanUpServerList(list) {
    return _.remove(list, function (key) {
        return key !== 'config' && key !== '_' && key !== 'default' ? key : '';
    })
}

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
    console.log(chalk.bgGreen(chalk.white('All Server removed')));
}

module.exports = removeServer;
