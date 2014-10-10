var chalk = require('chalk');
var Table = require('cli-table');
var behavior = require('./behavior');
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
            chars:behavior.tableChars
        }
    );
    helpCommands.forEach(function (value) {
        table.push([ chalk.yellow('mcab server ') + chalk.green(value[ 0 ]), chalk.cyan(value[ 1 ]) ]);
    });
    console.log(table.toString());
}

module.exports = help;
