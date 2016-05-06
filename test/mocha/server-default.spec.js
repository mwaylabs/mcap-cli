/**
 * Created by pascalbrewing on 08/10/14.
 */
var sinon = require('sinon');
var inquirer = require('inquirer');
var mcaprc = require('../../lib/rc');
require('should');
var serverDefault = require('../../lib/commands/server/default.js');

describe('mcap server', function () {
  describe('default', function () {
    var mcapRC = {
      default_server: 'local',
      server        : {
        "local"    : {
          baseurl : 'http://www.meine.de',
          username: 'admin',
          password: 'root'
        },
        "localMcap": {
          baseurl : 'http://www.meinemcap.de',
          username: 'admin',
          password: 'root'
        }
      }
    };
    var stubPrompt      = [];
    var stubMcapList    = '';
    var questions;
    var answer;
    beforeEach(function () {
      questions = [];
      stubPrompt = sinon.stub(inquirer, 'prompt', function (question, cb) {
        questions = question;
        cb(answer);
      });
      stubMcapList = sinon.stub(mcaprc, 'list', function () {
        return mcapRC;
      });
    });
    afterEach(function() {
      stubPrompt.restore();
      stubMcapList.restore();
    });
    /**
     * add a new Default server
     */
    it('should add a default server', function () {
      answer = {newDefault:'localMcap'};
      var stubMcapRc = sinon.stub(mcaprc, 'setDefault', function(config) {
        mcapRC.default_server = config;
        return true;
      });
      serverDefault.createDefault();
      questions[0].name.should.equal('newDefault');
      mcapRC.default_server.should.equal(answer.newDefault);
      stubMcapRc.restore();
      mcapRC = {default_server:'',server:{}};
    });
    /**
     * try to add a default server with only one server
     */
    it('should cant add a default server', function () {
      serverDefault.createDefault();
      mcapRC = {
        default_server: 'local',
        server        : {
          "local"    : {
            baseurl : 'http://www.meine.de',
            username: 'admin',
            password: 'root'
          }
        }
      };
    });
    it('should cant add a default server because only one exist', function () {
      serverDefault.createDefault();
    });
  });
});
