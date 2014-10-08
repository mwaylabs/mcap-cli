/**
 * Created by pascalbrewing on 08/10/14.
 */
var inquirer = require('inquirer');
var serverconfig = require('mcaprc');
var chalk = require('chalk');
var _ = require('lodash');
var figures = require('figures');
var displayTable = require('./behavior');

/**
 * set a Default Server is the available list > 1
 */
function createDefault() {
    var list = serverconfig.list();
    console.log('length',Object.keys(list[ 'server' ]).length);
    if ( Object.keys(list[ 'server' ]).length <= 0 ) {
        console.log(chalk.blue(figures.info), chalk.green('Your Server list is empty plz use "' + chalk.underline("mcap server add") + '" before'), figures.ellipsis);
        return true;
    }

    if ( Object.keys(list[ 'server' ]).length > 1 ) {
        setNewDefaultServer();

    } else {
        console.log(chalk.blue(figures.info), chalk.green('Your Server is always set as default'), figures.ellipsis);
    }
}

/**
 * if on remove the default Server in List choose other one
 * @param restServer
 * @private
 */
function setNewDefaultServer() {
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
module.exports = {
    setNewDefaultServer:setNewDefaultServer,
    createDefault:createDefault
};
