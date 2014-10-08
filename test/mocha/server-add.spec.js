'use strict';

/*jshint expr: true*/

var sinon = require('sinon');
var inquirer = require('inquirer');
var mcaprc = require('mcaprc');
require('should');
var serverAdd = require('../../lib/command/server/add.js');

describe('mcap server', function () {

    describe('add', function () {

        var stubMcapList, stubPromt;
        var answers = [];
        var questions = [];

        var defaultConfig = {
            name: 'local',
            baseUrl: 'http://localhost.de/',
            userName: 'admin',
            password: 'abc'
        };

        var mcapRC = {
            default_server: '',
            server: {}
        };

        beforeEach(function() {

            questions = [];
            stubPromt = sinon.stub(inquirer, 'prompt', function(question, cb) {
                questions.push(question);
                cb(answers.shift());
            });

            stubMcapList = sinon.stub(mcaprc, 'list', function() {
                return mcapRC;
            });
        });

        afterEach(function() {
            stubMcapList.restore();
            stubPromt.restore();
        });

        it('should add a new server', function () {
            answers = [defaultConfig, {
                addapp: 'Y'
            }];

            var stubMcapRc = sinon.stub(mcaprc, 'parse', function(command, config) {
                config.should.be.defined;
                config.should.be.an.Array;
                config.should.be.lengthOf(4);
                config[0].should.equal('local');
                config[1].should.equal('http://localhost.de/');
                config[2].should.equal('admin');
                config[3].should.equal('abc');

                mcapRC.default_server = defaultConfig.name;
                mcapRC.server[defaultConfig.name] = {
                    baseurl: defaultConfig.baseUrl,
                    username: defaultConfig.userName,
                    password: defaultConfig.password
                };
            });

            serverAdd();

            questions[1][0].name.should.equal('addapp');

            questions.should.be.lengthOf(2);
            Object.keys(mcapRC.server).should.be.lengthOf(1);
            stubMcapRc.restore();
        });

        it('should override an existing server', function () {

            defaultConfig.password = 'cba';

            answers = [defaultConfig, {
                overwriteapp: 'Y'
            }];

            var stubMcapRc = sinon.stub(mcaprc, 'parse', function() {
                mcapRC.default_server = defaultConfig.name;
                mcapRC.server[defaultConfig.name] = {
                    baseurl: defaultConfig.baseUrl,
                    username: defaultConfig.userName,
                    password: defaultConfig.password
                };

                Object.keys(mcapRC.server)[0].should.equal('local');
                mcapRC.server[defaultConfig.name].baseurl.should.equal('http://localhost.de/');
                mcapRC.server[defaultConfig.name].username.should.equal('admin');
                mcapRC.server[defaultConfig.name].password.should.equal('cba');
            });

            serverAdd();

            questions[1][0].name.should.equal('overwriteapp');
            questions.should.be.lengthOf(2);
            Object.keys(mcapRC.server).should.be.lengthOf(1);

            stubMcapRc.restore();
        });

    });

});
