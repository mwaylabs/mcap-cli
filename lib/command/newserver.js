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
var figures = require('figures');

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
 * the exists Commands
 * @type {*[]}
 */
var helpCommands = [
    [ 'help', 'List the mcap server commands' ],
    [ 'list', 'List all availables Server' ],
    [ 'add', 'Add a new Server' ],
    [ 'default', 'Set a Server as Default' ],
    [ 'remove', 'Remove one or many Server from th rc file' ]
];

/**
 * switch server command
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
            console.log('hallo list');
            return displayTable(serverconfig.list());
            break;
        default:
            return help();
            break;
    }
}

/**
 * return a list of availables commands
 * mcab server help command
 */
function help() {
    var table = new Table({ head: [ chalk.magenta('Command'), chalk.magenta('Info') ] });
    helpCommands.forEach(function (value) {
        table.push([ chalk.yellow('mcab server ') + chalk.green(value[ 0 ]), chalk.blue(value[ 1 ]) ]);
    });
    console.log(table.toString());
}

/**
 * set a Default Server is the available list > 1
 */
function createDefault() {
    var list = serverconfig.list();
    if ( Object.keys(list[ 'server' ]).length < 1 ) {
        console.log(chalk.blue(figures.info), chalk.green('Your Server list is empty plz use "' + chalk.underline("mcap server add") + '" before'), figures.ellipsis);
        return true;
    }

    if ( Object.keys(list[ 'server' ]).length > 1 ) {
        _setNewDefaultServer();

    } else {
        console.log(chalk.blue(figures.info), chalk.green('Your Server is always set as default'), figures.ellipsis);
    }
}

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
                _setNewDefaultServer(server);
            } else {
                displayTable(serverconfig.list());
            }

        });
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

/**
 * if on remove the default Server in List choose other one
 * @param restServer
 * @private
 */
function _setNewDefaultServer() {
    var list = serverconfig.list();

    // remove the default server from the available list
    delete list[ 'server' ][ list[ serverconfig.default_server ] ];
    var keys = _.keys(list[ 'server' ]);
    var choices = _.chain(keys).map(function (server) {
        return { 'name': server };
    }).value();

    return inquirer.prompt(
        [
            {
                type    : "list",
                message : "Plz choose a new Default Server",
                name    : "newDefault",
                choices : choices,
                validate: function (answer) {
                    if ( answer.length < 1 ) {
                        return "You must choose at least one server.";
                    }
                    return true;
                }
            }
        ], function (answer) {
            if ( answer.newDefault ) {
                var promise = serverconfig.setDefault(answer.newDefault);
                if ( promise ) {
                    return displayTable(serverconfig.list());
                } else {
                    console.log(chalk.bgRed(chalk.yellow(figures.warning), chalk.white('Something went wrong on setting Default Server. ')));
                }
            }
            return false;
        });
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
                var conf = serverconfig.list();
                var rawAnswer = answers;
                var exist = conf[ 'server' ][ rawAnswer.name ] ? true : false;
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

                // Server allready exist
                if ( exist ) {
                    inquirer.prompt(
                        [
                            {
                                type   : "confirm",
                                name   : "overwriteapp",
                                message: chalk.red(rawAnswer.name) + " already exist , you want to override it? ",
                                default: true
                            }
                        ],
                        function (answers) {
                            if ( answers.overwriteapp ) {
                                serverconfig.parse(program.server, [ rawAnswer.name, rawAnswer.baseUrl, rawAnswer.userName, rawAnswer.password ]);
                                console.log(chalk.green('Server is added'));
                                return displayTable(serverconfig.list());
                            } else {
                                console.log(chalk.red('Abort'));
                            }
                        }
                    );
                } else {
                    //not exist wanna add ?
                    inquirer.prompt(
                        configAddConfirm,
                        function (answers) {
                            if ( answers.addapp ) {

                                serverconfig.parse(program.server, [ rawAnswer.name, rawAnswer.baseUrl, rawAnswer.userName, rawAnswer.password ]);
                                console.log(chalk.green('Server is added'));
                                displayTable(serverconfig.list());
                            } else {
                                console.log(chalk.green('Abort'));
                            }
                        }
                    );
                }
            }
        }
    );
}

/**
 * get the all servers from the mcaprc
 *
 * @param result
 */
function displayTable(result) {


    // if length 1 we have a empty json with only {default:''}
    // first time
    if ( typeof result === 'object' && Object.keys(result).length > 1 ) {

        var keys = _.keys(result.server);

        var table = new Table(
            {
                head    : [ chalk.magenta("Server"), chalk.magenta("Default"), chalk.magenta("Option"), chalk.magenta("Value") ],
                colWidth: [ 200, 200, 200, 200 ]
            }
        );

        // get the server from the Json
        keys.forEach(function (key) {
            var inverseKeys = _.keys(result[ 'server' ][ key ]);
            if ( key !== serverconfig.default_server ) {

                if ( inverseKeys.length > 0 ) {
                    var i = 0;
                    inverseKeys.forEach(function (subkey, count) {
                        if ( key !== serverconfig.default_server ) {
                            table.push(
                                [
                                    i === 0
                                        ? chalk.cyan(key)
                                        : '',
                                    i === 0
                                        ? isDefault(result[ serverconfig.default_server ], key)
                                        : '',

                                    chalk.blue(inverseKeys[ count ]),

                                    result[ 'server' ][ key ][ subkey ] !== ''
                                        ? chalk.green(result[ 'server' ][ key ][ subkey ])
                                        : chalk.red('na')
                                ]
                            );
                            i++;
                        }
                    });
                }
            }
        });
        console.log(table.toString());
    } else {
        console.log(chalk.bgYellow(chalk.red(figures.warning) + chalk.black('Looks like no Server was defined. ')));
    }
}
/**
 * check if default Server or not
 * @param defaultName
 * @param serverName
 * @returns {*}
 */
function isDefault(defaultName, serverName) {

    if ( defaultName === serverName ) {
        return chalk.green(figures.tick);
    } else {
        return chalk.red(figures.cross);
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
