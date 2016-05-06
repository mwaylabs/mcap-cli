'use strict';

var mctCore = require('../../lib/core');
var assert = require('assert');
var sinon = require('sinon');
var mcapLogger  = require('../../lib/logger');
var q = require('q');

describe('.logger()', function () {
  var stubLogger;
  var stubResume;

  beforeEach(function() {
    stubLogger = sinon.stub(mcapLogger.prototype, 'watch', function() {
      var deferred = q.defer();
      deferred.resolve();
      return deferred.promise;
    });

    stubResume = sinon.stub(process.stdin, 'resume', function() {
      // Do not resume stdin during running tests,
      // because this will block mocha from finishing.
    });
  });

  afterEach(function() {
    stubLogger.restore();
    stubResume.restore();
  });

  it('require options', function () {
    assert.throws(mctCore.logger.bind(null));
  });

  it('take options', function () {
    mctCore.logger({
      baseurl: 'http://mcap.mway.io',
      username: 'mway',
      password: 'mway',
      appUUID: '3785733C-B873-4D43-AC88-8CB5C38407EA'
    });
  });
});
