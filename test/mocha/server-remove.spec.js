/**
 * Created by pascalbrewing on 08/10/14.
 */
var sinon = require('sinon');
var inquirer = require('inquirer');
var mcaprc = require('mcaprc');
var _ = require('lodash');
require('should');
var serverRemove = require('../../lib/command/server/remove.js');

describe('mcap server', function () {
    describe('remove', function () {

        /**
         * @type {{default_server: string, server: {local: {baseurl: string, username: string, password: string},
         *   localMcap: {baseurl: string, username: string, password: string}, localMcappps: {baseurl: string,
         *   username: string, password: string}, localMcaps: {baseurl: string, username: string, password: string},
         *   losscalMcaps: {baseurl: string, username: string, password: string}}}}
         */
        var raw = {
            default_server: 'local',
            server        : {
                "local"       : {
                    baseurl : 'http://www.meine.de',
                    username: 'admin',
                    password: 'root'
                },
                "localMcap"   : {
                    baseurl : 'http://www.meinemcap.de',
                    username: 'admin',
                    password: 'root'
                },
                "localMcappps": {
                    baseurl : 'http://www.meinemcap.de',
                    username: 'admin',
                    password: 'root'
                },
                "localMcaps"  : {
                    baseurl : 'http://www.meinemcap.de',
                    username: 'admin',
                    password: 'root'
                },
                "losscalMcaps": {
                    baseurl : 'http://www.meinemcap.de',
                    username: 'admin',
                    password: 'root'
                }
            }
        };
        /**
         * @type {{}}
         */
        var mcapRC = {};
        /**
         * @type {Array}
         */
        var questions = [];
        /**
         * @type {Array}
         */
        var stubPrompt = [];
        /**
         * @type {Array}
         */
        var answers = [];
        /**
         * @type {{}}
         */
        var stubMcapList = {};
        /**
         * @type {string[]}
         */
        var deleteServer = [ 'losscalMcaps', 'localMcaps' ];
        /**
         * @type {string[]}
         */
        var deleteServerWithDefault = [ 'local','losscalMcaps', 'localMcaps' ];

        beforeEach(function () {
            stubPrompt = sinon.stub(inquirer, 'prompt', function (question, cb) {
                questions = question;
                cb(answers.shift());
            });

            stubMcapList = sinon.stub(mcaprc, 'list', function () {
                return mcapRC = _.assign(raw,mcapRC);
            });
        });

        afterEach(function () {
            stubPrompt.restore();
            stubMcapList.restore();
        });

        /**
         * remove some server from the list
         */
        it("should remove some server", function () {
            answers = [ { server: deleteServer } ];
            var removeServersRc = sinon.stub(mcaprc, 'remove', function (name) {
                delete mcapRC.server[ name ];
            });
            serverRemove();
            questions[ 0 ].name.should.equal('server');
            Object.keys(mcapRC.server).length.should.equal(3);
            mcapRC.default_server.should.equal('local');
            removeServersRc.restore();
        });

        /**
         * remove some server and the default server too to add a new default server
         */

        it("should remove some server with default", function () {
            answers = [ { server: deleteServerWithDefault }, { newDefault: 'localMcap' } ];
            var removeServersRc = sinon.stub(mcaprc, 'remove', function (name) {
                delete mcapRC.server[ name ];
            });
            var defaultRC = sinon.stub(mcaprc, 'setDefault', function (config) {
                mcapRC.default_server = config;
                return true;
            });

            serverRemove();
            questions[0].name.should.equal('newDefault');
            Object.keys(mcapRC.server).length.should.equal(2);
            mcapRC.default_server.should.equal('localMcap');
            removeServersRc.restore();
            defaultRC.restore();
        });

        /**
         * remove all server from tghe list
         */
        it("should remove all server", function () {
            answers = [ { server: ['all'] } ];
            var removeServersRc = sinon.stub(mcaprc, 'remove', function (name) {
                delete mcapRC.server[ name ];
            });

            var defaultRC = sinon.stub(mcaprc, 'setDefault', function (config) {
                mcapRC.default_server = '';
                return true;
            });

            serverRemove();
            questions[ 0 ].name.should.equal('server');
            Object.keys(mcapRC.server).length.should.equal(0);
            mcapRC.default_server.should.equal('');
            removeServersRc.restore();
            defaultRC.restore();
        });
    });
});
