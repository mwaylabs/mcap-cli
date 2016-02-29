/*global describe, beforeEach, it*/
'use strict';

var assert = require('yeoman-generator').assert;
var helper = require('./helper');

describe('m-server:app', function () {
  beforeEach(function (done) {

    var answers = {
      name: 'MyApp'
    };

    // Creates a generateor with the default options / arguments
    helper.createAppGenerator({
      answers: answers
    }, done);
  });

  it('creates expected files', function () {

    var expectedFiles = [
      'package.json',
      'app.js',
      'routes/index.js',
      'routes/overview.js'
    ];
    var expectedContent = [
      ['package.json', helper.regExpFromString('"name": "MyApp"')]
    ];

    assert.file(expectedFiles);
    assert.fileContent(expectedContent);
  });

  it('creates app with given name', function (done) {

    var expectedContent = [
      ['package.json', helper.regExpFromString('"name": "Hello"')]
    ];

    var options = {
      name: 'Hello'
    };

    // Creates a generateor with the default options / arguments
    helper.createAppGenerator({
      options: options
    }, function() {
      assert.fileContent(expectedContent);
      done();
    });
  });

  it('anchors are visible', function () {
    var expectedContent = [
      ['app.js', helper.regExpFromString('//build::require')],
      ['app.js', helper.regExpFromString('//build::middleware')]
    ];

    assert.fileContent(expectedContent);
  });

});
