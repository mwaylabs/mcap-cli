'use strict';
var mcapServe = require('mcap-serve');
var serverconfig = require('mcaprc');
var path = require('path');
var log = require('../logger')(__filename);
var printCat = require('../printcat');
var getCurrentAuthentication = require('../currentAuthentication');
var inquirer = require('inquirer');
/**
 * @type {number}
 */
var connectPort = 9100;
/**
 *
 * @param {string} baseurl
 * @param {string} orga
 * @param {string} appName
 * @param {string} api
 * @returns {string}
 */
var getEndpoint = function (baseurl, orga, appName, api) {
    var endpoint = '';
    endpoint += baseurl;
    if ( endpoint.charAt(endpoint.length - 1 !== '/') ) {
        endpoint += '/';
    }
    endpoint += orga + '/';
    endpoint += appName;
    endpoint += api;
    return endpoint;
};
/**
 * @param {object} program
 * @param {method} cb
 */
module.exports.setPort = function (program, cb) {
    var portRegex = /^(\d){2}$|(\d){4}$/;
    /**
     * @description set a manual port to your localhost
     * @private
     */
    function _setManualPort() {
        inquirer.prompt(
        [
            {
                type    : "input",
                name    : "manual_port",
                message : "Set youre Port plz",
                validate: function (value) {
                    var pass = value.match(portRegex);
                    if ( pass ) {
                        return true;
                    } else {
                        return "Plz enter a valid Port example 80,9200";
                    }
                }
            }
        ],
        function (answer) {
            if ( answer.manual_port ) {
                connectPort = Number(answer.manual_port);
            }
            cb(connectPort);
        });
    }
    /**
     * @description default is 9200,choose your port where you wanna start the server
     * @private
     */
    function _getPort() {
        inquirer.prompt(
        [
            {
                type   : "list",
                name   : "port",
                message: "Choose Port",
                choices: [
                    "9100",
                    "manual"
                ]
            }
        ],
        function (answer) {
            if ( answer.port === 'manual' ) {
                return _setManualPort();
            } else {
                cb(Number(answer.port));
            }
        });
    }
    _getPort();
};
/**
 * @todo add description
 * @param {object} program
 * @param {method} cb
 * @returns {*}
 */
module.exports.prepare = function (program, cb) {
    var server = null;
    if ( program.serve === true ) {
        server = serverconfig.get(serverconfig.default_server);
    } else if ( program.serve ) {
        server = serverconfig.get(program.serve);
    }
    if ( !server ) {
        var err = 'Missing server configuration or missing server instance.';
        printCat.error(err);
        return log.info(err);
    }
    var dir = process.cwd();
    if ( program.cwd ) {
        dir = program.cwd;
    }
    var mcapJson = require(path.resolve(dir, 'mcap.json'));
    var appName = mcapJson.name;
    var api = '/api/dataSync';
    printCat.info('Fetching informations');
    getCurrentAuthentication(server, function (err, data) {
        var orga;

        if ( data && data.organization && data.organization.uniqueName ) {
            orga = data.organization.uniqueName;
        } else {
            orga = 'system';
            printCat.warning('App is running without connection to %s', server.baseurl);
        }
        cb(server.baseurl, orga, appName, api);
    });
};
module.exports.serve = function (program) {
    // choose your own port
    module.exports.setPort(program, function (port) {
        module.exports.prepare(program, function (baseurl, orga, appName, api) {
            mcapServe(
            {
                root            : './client',
                enableLivereload: true,
                port            : port,
                endpoint        : getEndpoint(baseurl, orga, appName, api)
            }, function (err) {
                if ( err ) {
                    printCat.error(err);
                    process.exit(1);
                }
            });
        });
    });
};
