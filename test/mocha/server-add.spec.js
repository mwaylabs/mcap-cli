'use strict';

/*jshint expr: true*/

var sinon = require('sinon');
var inquirer = require('inquirer');
var mcaprc = require('../../lib/rc');
require('should');
var serverAdd = require('../../lib/commands/server/add.js');

describe('mcap server', function () {

  describe('add', function () {

    var stubMcapList, stubPromt, stubMcapRc;
    var answers = [];
    var questions = [];

    var serverConfig = {
      name: 'local',
      baseUrl: 'http://localhost.de/',
      userName: 'admin',
      password: 'abc'
    };

    var rc = {
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
        return rc;
      });

      stubMcapRc = sinon.stub(mcaprc, 'parse', function(command, config) {
        config.should.be.defined;
        config.should.be.an.Array;
        config.should.be.lengthOf(4);
        config[0].should.equal(serverConfig.name);
        config[1].should.equal(serverConfig.baseUrl);
        config[2].should.equal(serverConfig.userName);
        config[3].should.equal(serverConfig.password);

        rc.default_server = serverConfig.name;
        rc.server[serverConfig.name] = {
          baseurl: serverConfig.baseUrl,
          username: serverConfig.userName,
          password: serverConfig.password
        };
      });
    });

    afterEach(function() {
      stubMcapList.restore();
      stubPromt.restore();
      stubMcapRc.restore();
    });

    it('should add a new server', function () {
      answers = [serverConfig, {
        addapp: 'Y'
      }];

      serverAdd();

      questions[1][0].name.should.equal('addapp');
      questions.should.be.lengthOf(2);
      Object.keys(rc.server).should.be.lengthOf(1);
      stubMcapRc.restore();
    });

    it('should override an existing server', function () {

      serverConfig.password = 'cba';
      answers = [serverConfig, {
        overwriteapp: 'Y'
      }];

      serverAdd();

      questions[1][0].name.should.equal('overwriteapp');
      questions.should.be.lengthOf(2);
      Object.keys(rc.server).should.be.lengthOf(1);

      stubMcapRc.restore();
    });

  });

});
