/**
 * Created by pascalbrewing on 01/10/14
 *
 */

"use strict";
var inquirer = require('inquirer');
var serverconfig = require('mcaprc');
var chalk = require('chalk');
var _ = require('lodash');
var Table = require('cli-table');

var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
var stringPattern = /^[a-zA-Z\s]+$/;

/**
 * config for Addding
 * @type {*[]}
 */
var configAdd = [
    {
        type    : "input",
        name    : "name",
        message : "Application Name",
        validate: function (value) {
            var pass = value.match(stringPattern);
            if ( pass ) {
                return true;
            } else {
                return "Please enter a valid Application name";
            }
        }
    },
    {
        type    : "input",
        name    : "baseUrl",
        message : "Enter the project url (http://....)",
        validate: function (value) {
            var pass = value.match(urlPattern);

            if ( pass ) {
                return true;
            } else {
                return "Please enter a valid url";
            }
        }
    },
    {
        type   : "input",
        name   : "userName",
        message: "Enter your username"
    },
    {
        type   : "password",
        name   : "password",
        message: "Enter your Password"
    }

];

/**
 * the confirm if you wanna add Y/N
 * @type {{type: string, name: string, message: string, default: boolean}[]}
 */
var configAddConfirm = [
    {
        type   : "confirm",
        name   : "addapp",
        message: "Wanna add the app with the following configuration ? ",
        default: true
    }
];

/**
 * start server command
 * @param program
 */
function newserver(program) {
    switch ( program.server ) {
        case 'add':
            return addServer(program);
            break;
        case 'default':
            return createDefault(program);
            break;
        case 'remove':
            return removeServer(program);
            break;
        case 'list':
            var result = serverconfig.parse(program.server, program.args);
            return createOutput(result);
            break;
        default:

            break;
    }
}

/**
 * set a Default Server is the available list > 1
 */
function createDefault(program)
{
    var list = serverconfig.list();
        delete list[list.default];
        delete list.default;
        delete list.config;
        delete list._;

        if(Object.keys(list).length > 0){
            var keys    = _.keys(list);
            var choices = _.chain(keys).map(function (server) {
                return { 'name': server };
            }).value();
            _setNewDefaultServer(choices);

        }else{
            console.log(chalk.bgGreen(chalk.white('Your Server is always set as default')));

        }
}
/**
 *
 * @param program
 */
function removeServer(program) {
    var list = getServerList(program.server);
    var serverKeys = _cleanUpServerList(_.keys(list));

    //console.log(list,serverKeys);
    var choices = [];
    var defaultServerName = null;

    serverKeys.forEach(function (value, key) {
        if ( value === list.default ) {
            defaultServerName = value;
        }
        choices.push({ name: value });
    });
    _setRemoveCommand(choices, defaultServerName);
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
                    console.log('answer');
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
                choices.forEach(function (value) {
                    console.log(value.name);
                    if ( value.name !== 'all' ) {
                        serverconfig.remove(value.name);
                    }
                });
                var list = getServerList('server');
                console.log(chalk.bgGreen(chalk.white('All Server removed')));
                return createOutput(list);
            }
            /**
             * @todo remove command only delete single server not a array of server
             */

            if ( answers.server ) {
                console.log('answers.server', answers.server);
                answers.server.forEach(function (value) {
                    serverconfig.remove(value);
                })
            }

            var choosenServerLength = Object.keys(answers.server).length;
            var deleteDefault = _.difference(answers.server, [ defaultServerName ]);

            if ( deleteDefault.length === choosenServerLength ) {
                var list = getServerList('server');
                console.log(chalk.bgGreen(chalk.white('Server removed')));
                return createOutput(list);
            } else {
                var restServer = _defaultServerChange(_.pluck(choices, 'name'), defaultServerName, answers.server);

                if ( Array.isArray(restServer) && restServer.length > 0 ) {
                    _setNewDefaultServer(restServer);
                } else {
                    serverconfig.setDefault('');
                    console.log(chalk.bgGreen(chalk.white('Server Default resetted')));
                }
            }

        });
}

/**
 * return a Array of availables Server
 * @private
 */
function _defaultServerChange(list, defaultserver, choosen) {
    var listDiffWithoutDefault = _.difference(list, [ defaultserver ]);
    var listDiffWithoutDeleting = _.difference(list, choosen);

    if ( listDiffWithoutDeleting.length > 0 ) {
        return _.chain(listDiffWithoutDeleting).map(function (server) {
            return { 'name': server };
        }).value();
    }
    return false;
}

/**
 * if on remove the default Server in List choose other one
 * @param restServer
 * @private
 */
function _setNewDefaultServer(restServer) {
    console.log('restServer', restServer);

    return inquirer.prompt(
        [
            {
                type    : "list",
                message : "Plz choose a new Default Server",
                name    : "newDefault",
                choices : restServer,
                validate: function (answer) {
                    if ( answer.length < 1 ) {
                        return "You must choose at least one server.";
                    }
                    return true;
                }
            }
        ], function (answer) {
            if ( answer.newDefault ) {
                serverconfig.setDefault(answer.newDefault);
                console.log(chalk.bgGreen(chalk.white('Server Default set')));
                return createOutput(serverconfig.list());
            }
            return false;
        });
}
/**
 * return the whole list of server from rc
 * @param server
 * @returns {*}
 */
function getServerList(server) {
    return serverconfig.parse(server, 'list');
}

/**
 * add a new JSON Object to .mcaprc
 * @param program
 */
function addServer(program) {
    inquirer.prompt(
        configAdd,
        function (answers) {
            if ( answers ) {
                var rawAnswer = answers;
                var newServerConfigTable = new Table({ head: [ 'Name', 'Base Url', 'User Name', 'Password' ] });
                newServerConfigTable.push(
                    [
                        rawAnswer.name,
                        rawAnswer.baseUrl,
                        rawAnswer.userName,
                        rawAnswer.password
                    ]
                );

                configAddConfirm[ 0 ].message += '\n' + newServerConfigTable + '\n';

                inquirer.prompt(
                    configAddConfirm,
                    function (answers) {
                        if ( answers.addapp ) {
                            serverconfig.parse(program.server, [ rawAnswer.name, rawAnswer.baseUrl, rawAnswer.userName, rawAnswer.password ]);
                            console.log(chalk.green('Server is added'));

                            createOutput(serverconfig.list());
                        } else {
                            console.log(chalk.green('Abort'));
                        }
                    }
                );
            }
        }
    );
}

/**
 * get the all servers from the mcaprc
 *
 * @param result
 */
function createOutput(result) {
    if ( typeof result === 'object' && Object.keys(result).length > 0 ) {

        var keys = _.keys(result);
        var servers = _.remove(keys, function (key) {
            return key !== 'config' && key !== '_' ? key : '';
        });

        // server table
        var table = new Table(
            {
                head    : [ chalk.magenta("Server"), chalk.magenta("Option"), chalk.magenta("Value") ],
                colWidth: [ 200, 200, 200 ]
            }
        );
        //default server
        var defaultTable = new Table(
            {
                head    : [ 'Default Server ', 'Name' ],
                colWidth: [ 200, 200 ]
            }
        );

        // get the server from the Json
        servers.forEach(function (key) {

            var inverseKeys = _.keys(result[ key ]);
            var message = '';
            var tableContent = null;

            if ( key !== 'default' ) {

                if ( inverseKeys.length > 0 ) {
                    var i = 0;
                    inverseKeys.forEach(function (subkey, count) {
                        if ( key !== 'default' ) {
                            table.push([
                                           i === 0
                                               ? chalk.cyan(key)
                                               : '',

                                           chalk.blue(inverseKeys[ count ]),

                                           result[ key ][ subkey ] !== ''
                                               ? chalk.green(result[ key ][ subkey ])
                                               : chalk.red('na')
                                       ]);
                            i++;
                        }
                    });
                }
            } else {
                defaultTable.push([ key, chalk.magenta(result.default) ]);
            }
        });
        console.log(defaultTable.toString());
        console.log(table.toString());
    } else {
        console.log('Looks like no Server was defined');
    }
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

module.exports = newserver;
