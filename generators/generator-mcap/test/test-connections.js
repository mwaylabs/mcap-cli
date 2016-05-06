/*global describe, beforeEach, it*/
'use strict';

var assert = require('yeoman-generator').assert;
var helper = require('./helper');

describe('mcap:connections', function () {
  beforeEach(function (done) {

    var answers = {
      name: 'MyApp'
    };

    // Creates a generateor with the default options / arguments
    helper.createAppGenerator({
      answers: answers
    }, done);
  });

  it('creates expected files', function (done) {
    var expectedFiles = [
      'connections/sap.json'
    ];
    var expectedContent = {
      name: 'SAP',
      description: 'SAP API',
      type: 'rest',
      properties: {
        descriptorUrl: 'http://sap.mway.io',
        username: 'admin',
        password: 'root'
      }
    };
    var answers = {
      name: 'SAP',
      description: 'SAP API',
      descriptorUrl: 'http://sap.mway.io',
      username: 'admin',
      password: 'root'
    };

    helper.createSubGenerator('connection', {answers: answers}, function () {
      assert.file(expectedFiles);
      helper.deepEqual('connections/sap.json', expectedContent);
      done();
    });
  });
});
