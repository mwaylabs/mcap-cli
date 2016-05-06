/*global describe, beforeEach, it*/
'use strict';

var assert = require('yeoman-generator').assert;
var helper = require('./helper');

describe('m-server:bikini', function () {
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
      'app.js',
      'routes/foobar.js'
    ];

    helper.createSubGenerator('bikini', {args: ['fooBar']}, function() {
      assert.file(expectedFiles);
      done();
    });
  });

  it('middleware is set', function (done) {
    var expectedContent = [
      ['app.js', helper.regExpFromString('app.use(\'/foobar\', fooBar')],
      ['app.js', helper.regExpFromString('var fooBar = require(\'./routes/foobar.js\')')]
    ];

    helper.createSubGenerator('bikini', {args: ['fooBar']}, function() {
      assert.fileContent(expectedContent);
      done();
    });
  });

  it('middleware is set with primary key', function (done) {
    var expectedContent = [
      ['routes/foobar.js', helper.regExpFromString('idAttribute: \'_uuid\'')]
    ];
    helper.createSubGenerator('bikini', {args: ['fooBar', '_uuid']}, function() {
      assert.fileContent(expectedContent);
      done();
    });
  });

  it('middleware is set with default primary key', function (done) {
    var expectedContent = [
      ['routes/foobar.js', helper.regExpFromString('idAttribute: \'_id\'')]
    ];
    helper.createSubGenerator('bikini', {args: ['fooBar']}, function() {
      assert.fileContent(expectedContent);
      done();
    });
  });

  it('set up bikini', function (done) {
    var expectedContent = [
      ['routes/foobar.js', helper.regExpFromString('entity: \'my-app-MetaModelContainer-fooBar\'')],
      ['routes/foobar.js', helper.regExpFromString('container: \'my-app MetaModelContainer\'')],
      ['routes/foobar.js', helper.regExpFromString('model: \'fooBar\'')],
    ];

    helper.createSubGenerator('bikini', {args: ['fooBar']}, function() {
      assert.fileContent(expectedContent);
      done();
    });
  });

});
