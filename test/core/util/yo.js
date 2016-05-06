'use strict';

var Yo = require('../../../lib/core/util/yo.js');
var assert = require('assert');
var generatorPath = require('../../../lib/core/util/generator-path.js');
var sinon = require('sinon');

describe('yo', function () {
  var stubExecuteYo;
  var stubGeneratorBasePath;

  beforeEach(function(done) {
    stubExecuteYo = sinon.stub(Yo.prototype, '_run', function(generator, opts, cb) {
      var DummyGen = {};
      cb(null, DummyGen);
    });

    stubGeneratorBasePath = sinon.stub(generatorPath, 'basePath', function() {
      return './';
    });

    this.yo = new Yo();
    this.yo.lookup(done);
  });

  afterEach(function() {
    stubExecuteYo.restore();
    stubGeneratorBasePath.restore();
  });

  it('run generator', function (done) {
    this.yo.run('gen1', {}, done);
    assert.ok(stubExecuteYo.calledOnce);
    assert.ok(stubExecuteYo.calledOnce);
  });

  it('run with sub generator', function (done) {
    this.yo.run(['gen1', 'subgen'], {}, done);
    assert.ok(stubExecuteYo.calledOnce);
    assert.ok(stubExecuteYo.calledOnce);
  });

});
