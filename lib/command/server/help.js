var chalk = require('chalk');
var Table = require('cli-table');
var fs = require('fs');
var path = require('path');
var mcapArt = fs.readFileSync(path.resolve(__dirname, '../../welcome.txt'), {encoding:'utf8'});
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
 * return a list of availables commands
 * mcab server help command
 */
function help() {
    var table = new Table(
        {
            head: [
                chalk.magenta('Command'),
                chalk.magenta('Info')
            ],
            chars:{
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
            }
        }
    );
    helpCommands.forEach(function (value) {
        table.push([ chalk.yellow('mcab server ') + chalk.green(value[ 0 ]), chalk.cyan(value[ 1 ]) ]);
    });
    console.log(mcapArt);
    console.log(table.toString());
}

module.exports = help;
