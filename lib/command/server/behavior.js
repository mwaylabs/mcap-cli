/**
 * Created by pascalbrewing on 08/10/14.
 */
var serverconfig = require('mcaprc');
var chalk = require('chalk');
var _ = require('lodash');
var Table = require('cli-table');
var figures = require('figures');
var fs = require('fs');
var path = require('path');
var mcapArt = fs.readFileSync(path.resolve(__dirname, '../../welcome.txt'), {encoding:'utf8'});
/**
 * check if default Server or not
 * @param {string} defaultName
 * @param {string} serverName
 * @returns {*}
 */
function _isDefault(defaultName, serverName) {

    if ( defaultName === serverName ) {
        return chalk.green(figures.radioOn);
    } else {
        return chalk.red(figures.cross);
    }
}
/**
 * get the all servers from the mcaprc
 *
 * @param {object} result
 */
function displayTable(result) {
    // if length 1 we have a empty json with only {default:''}
    // first time
    if ( typeof result === 'object' && Object.keys(result).length > 1 ) {
        var keys = _.keys(result.server);
        var table = new Table(
            {
                head    : [ chalk.magenta("Server"), chalk.magenta("Default"), chalk.magenta("Option"), chalk.magenta("Value") ],
                chars   : {
                    'top'         : '═',
                    'top-mid'     : '╤',
                    'top-left'    : '╔',
                    'top-right'   : '╗',
                    'bottom'      : '═',
                    'bottom-mid'  : '╧',
                    'bottom-left' : '╚',
                    'bottom-right': '╝',
                    'left'        : '║',
                    'left-mid'    : '╟',
                    'mid'         : '─',
                    'mid-mid'     : '┼',
                    'right'       : '║',
                    'right-mid'   : '╢',
                    'middle'      : '│'
                },
                colWidth: [ 200, 200, 200, 200 ],
                colAligns:['left','middle','left','left']
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
                                    i === 0 ? chalk.cyan(key)
                                        : '',
                                    i === 0 ? _isDefault(result[ serverconfig.default_server ], key)
                                        : '',

                                    chalk.yellow(inverseKeys[ count ]),

                                    result[ 'server' ][ key ][ subkey ] !== '' ? chalk.green(result[ 'server' ][ key ][ subkey ])
                                        : chalk.red('na')
                                ]
                            );
                            i++;
                        }
                    });
                }
            }
        });
        console.log(mcapArt);
        console.log(table.toString());
    } else {
        console.log(chalk.bgYellow(chalk.red(figures.warning) + chalk.black('Looks like no Server was defined. ')));
    }
}
module.exports = displayTable;
