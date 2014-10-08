/**
 * Created by pascalbrewing on 08/10/14.
 */

var serverconfig = require('mcaprc');
var chalk = require('chalk');
var _ = require('lodash');
var Table = require('cli-table');
var figures = require('figures');

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
                                        ? _isDefault(result[ serverconfig.default_server ], key)
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
function _isDefault(defaultName, serverName) {

    if ( defaultName === serverName ) {
        return chalk.green(figures.tick);
    } else {
        return chalk.red(figures.cross);
    }
}


module.exports = displayTable;
