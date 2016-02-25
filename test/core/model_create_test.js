'use strict';

var mctCore = require('../../lib/core');
var yo = require('../../lib/core/util/yo.js');
var checker = require('../../lib/core/util/checker.js');
var sinon = require('sinon');
var yeoman  = require('yeoman-generator');
var assert = yeoman.assert;

describe('.model.create()', function () {
  var stubExecuteYo;
  var stubGetProjectRoot;

  beforeEach(function() {
    stubExecuteYo = sinon.stub(yo.prototype, 'run', function(generator, opts, cb) {
      var DummyGen = {};

      if (generator === 'mcap:model') {
        DummyGen.prepareValues = function() {
          return {
            name: 'Todo'
          };
        };
      }

      cb(null, DummyGen);
    });

    stubGetProjectRoot = sinon.stub(checker, 'getProjectRoot', process.cwd);
  });

  afterEach(function() {
    stubExecuteYo.restore();
    stubGetProjectRoot.restore();
  });

  it('take a callback', function () {
    mctCore.model.create(function() {});
  });

  it('create with callback', function () {
    var callback = sinon.spy();
    mctCore.model.create(callback);

    assert.ok(stubExecuteYo.calledTwice);
    assert(stubExecuteYo.getCall(0).calledWith('mcap:model'));
    assert(stubExecuteYo.getCall(1).calledWith(['m-server:bikini', 'Todo']));

    assert.ok(callback.calledOnce);
  });

});
