'use strict';

var Gulp = require('../../../lib/core/util/gulp.js');
var assert = require('assert');
var sinon = require('sinon');

describe('gulp', function () {

  beforeEach(function() {

     this.spawnMock = {
      stdout: {
        setEncoding: sinon.stub(),
        on: sinon.stub()
      },
      stderr: {
        setEncoding: sinon.stub(),
        on: sinon.stub()
      },
      on: sinon.stub()
    };

    this.sandbox = sinon.sandbox.create();
    this.sandbox.stub(process, 'chdir', sinon.stub());
    this.gulp = new Gulp(process.cwd());
    this.sandbox.stub(this.gulp, 'spawnCommand', function() {
      return this.spawnMock;
    }.bind(this));
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('.run', function () {

    it('require a location', function () {
      assert.throws(this.gulp.run.bind(null));
    });

    it('location must be client or server', function () {
      assert.throws(this.gulp.run.bind(null, 'foo'));
    });

    it('take location client', function () {
      assert.doesNotThrow(this.gulp.run.bind(this.gulp, 'client'));
    });

    it('take location server', function () {
      assert.doesNotThrow(this.gulp.run.bind(this.gulp, 'server'));
    });

    it('without error', function (done) {
      this.gulp.on('exit', function(exitCode){
        assert.equal(exitCode, 0);
        done();
      });

      this.spawnMock.on.callsArgWith(1, 0);
      this.gulp.run('client');
    });

    it('with an error', function (done) {
      this.gulp.on('exit', function(exitCode){
        assert.equal(exitCode, 1);
        done();
      });

      this.spawnMock.on.callsArgWith(1, 1);
      this.gulp.run('client');
    });
  });

  it('emit error', function (done) {
    this.gulp.on('error', function(data){
      assert.equal(data, 'foo\nbar\nbaz');
      done();
    });

    this.spawnMock.stderr.on.callsArgWith(1, 'foo\nbar\nbaz\n');
    this.gulp.run('client');
  });

  it('emit data', function (done) {
    this.gulp.on('data', function(data){
      assert.equal(data, 'foo\nbar\nbaz');
      done();
    });

    this.spawnMock.stdout.on.callsArgWith(1, 'foo\nbar\nbaz\n');
    this.gulp.run('client');
  });
});
