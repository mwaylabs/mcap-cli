'use strict';
/**
 * Created by pascalbrewing on 30/10/14.
 */
/**
 * Created by pascalbrewing on 08/10/14.
 */
var util = require('util');
var chalk = require('chalk');
var _ = require('lodash');
var Table = require('cli-table');
var figures = require('figures');
var serverconfig = require('mcaprc');
/**
 * @example 80 or 9200 min 2 ,max 4
 * @type {RegExp}
 */
var portRegex = /^(\d){2}$|(\d){4}$/;
/**
 * url Pattern allowed
 * @example https://localkllk:9100/blubber&id=234 http://localkllk.de/blubber&id=234
 * @type {RegExp}
 */
var urlPattern = /(http|https):\/\/[\w-]+(\.[\w-]+)|(\:[0-9])([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
/**
 * allow a-Z 0-9 for the server name
 * @type {RegExp}
 */
var stringNumberPattern = /^[a-zA-Z\s]|[0-9\s]+$/;
/**
 * check if the value not empty
 * @param {string} label
 * @returns {Function}
 */
var notEmptyValidate = function (label) {
  return function (value) {
    if ( value ) {
      return true;
    }
    return util.format('%s can not be empty', label);
  };
};
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
 * prepare the table formatting
 * @link https://www.npmjs.org/package/cli-table
 * @type {{top: string, top-mid: string, top-left: string, top-right: string, bottom: string, bottom-mid: string,
 *   bottom-left: string, bottom-right: string, left: string, left-mid: string, mid: string, mid-mid: string, right:
 *   string, right-mid: string, middle: string}}
 */
var tableChars = {
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
};
/**
 * get the all servers from the mcaprc
 *
 * @param {object} config
 */
function displayTable(config) {
  // if length 1 we have a empty json with only {default:''}
  // first time
  if ( typeof config === 'object' && Object.keys(config.server).length > 0 ) {
    var keys = _.keys(config.server);
    var table = new Table(
      {
        head     : [ chalk.magenta('Server'), chalk.magenta('Default'), chalk.magenta('Option'), chalk.magenta('Value') ],
        chars    : tableChars,
        colWidth : [ 200, 200, 200, 200 ],
        colAligns: [ 'left', 'middle', 'left', 'left' ]
      }
    );
    // get the server from the Json
    keys.forEach(function (key) {
      var inverseKeys = _.keys(config[ 'server' ][ key ]);
      if ( key !== serverconfig.default_server ) {

        if ( inverseKeys.length > 0 ) {
          var i = 0;
          inverseKeys.forEach(function (subkey, count) {
            if ( key !== serverconfig.default_server ) {
              table.push(
                [
                  i === 0 ? chalk.cyan(key)
                    : '',
                  i === 0 ? _isDefault(config[ serverconfig.default_server ], key)
                    : '',

                  chalk.yellow(inverseKeys[ count ]),

                  config[ 'server' ][ key ][ subkey ] !== '' ? chalk.green(config[ 'server' ][ key ][ subkey ])
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
module.exports = {
  displayTable    : displayTable,
  notEmptyValidate: notEmptyValidate,
  pattern         : {
    url         : urlPattern,
    stringNumber: stringNumberPattern,
    port        : portRegex
  },
  tableChars      : tableChars
};
