/*global describe, beforeEach, it*/
'use strict';

var assert = require('yeoman-generator').assert;
var helper = require('./helper');

describe('mcap-project creation', function () {

  describe('with prompts', function () {
    beforeEach(function (done) {

      var answers = {
        name: 'My mCAP Project'
      };

      // Creates a generateor with the default options / arguments
      helper.createAppGenerator({
        answers: answers
      }, done);
    });

    it('creates files', function () {

      var expectedFiles = [
        'mcap.json',
        '.editorconfig',
        '.gitattributes',
        '.gitignore',
        '.mcapignore',
        '.jshintrc',
        'client',
        'server'
      ];

      var expectedContent = [
        ['mcap.json', /"name": "My mCAP Project"/],
        ['mcap.json', /"baseAlias": "\/myMCapProject"/],
        ['mcap.json', /uuid": "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/]
      ];

      assert.file(expectedFiles);
      assert.fileContent(expectedContent);
    });
  });

  describe('with options', function () {
    beforeEach(function (done) {

      var answers = {
        name: 'MymCAPProjectApp'
      };

      // Creates a generateor with the default options / arguments
      helper.createAppGenerator({
        answers: answers
      }, done);
    });

    it('creates files', function () {

      var expectedFiles = [
        'mcap.json'
      ];

      var expectedContent = [
        ['mcap.json', /"name": "MymCAPProjectApp"/],
        ['mcap.json', /"baseAlias": "\/mymCapprojectApp"/]
      ];

      assert.file(expectedFiles);
      assert.fileContent(expectedContent);
    });
  });
});
