'use strict';
'use strict';

var mctCore = require('../../lib/core');
var sinon = require('sinon');
var fs = require('fs');
var yeoman  = require('yeoman-generator');
var mcapDeploy  = require('../../lib/deploy');
var q = require('q');
var assert = yeoman.assert;
var GulpUtil = require('../../lib/core/util/gulp.js');
var checker = require('../../lib/core/util/checker.js');

describe('.deploy()', function () {
  var stubDeploy;
  var stubExecuteGulp;
  var stubGetProjectRoot;
  var stubFs;

  beforeEach(function() {
    stubDeploy = sinon.stub(mcapDeploy, 'deploy', function(options) {
      var deferred = q.defer();
      if (options.baseurl === 'error-case') {
        deferred.reject(new Error('some-error'));
      } else {
        deferred.resolve('http://localhost/orga/myapp/');
      }

      return deferred.promise;
    });

    stubExecuteGulp = sinon.stub(GulpUtil.prototype, '_run', function() {
      this.emit('exit', 0);
    });

    stubGetProjectRoot = sinon.stub(checker, 'getProjectRoot', process.cwd);
    stubFs = sinon.stub(fs, 'existsSync');
  });

  afterEach(function() {
    stubDeploy.restore();
    stubExecuteGulp.restore();
    stubGetProjectRoot.restore();
    stubFs.restore();
  });

  it('require options', function () {
    assert.throws(mctCore.deploy.bind(null));
  });

  it('take options', function () {
    mctCore.deploy({
      rootPath: './path/to/myapp/'
    });
  });

  it('deploy with client', function (done) {
    var options = {
      baseurl: 'http://localhost/',
      username: 'admin',
      password: 'password',
      baseAlias: 'myapp',
      rootPath: './path/to/myapp/'
    };

    var handler = function(data) {
      assert.equal(data.client, 'http://localhost/orga/myapp/index.html');
      assert.equal(data.server, 'http://localhost/orga/myapp/');
      done();
    };

    stubFs.returns(true);
    mctCore.deploy(options).on('complete', handler);
  });


  it('deploy without client', function (done) {
    var options = {
      baseurl: 'http://localhost/',
      username: 'admin',
      password: 'password',
      baseAlias: 'myapp',
      rootPath: './path/to/myapp/'
    };

    var handler = function(data) {
      assert.ok(!data.client);
      assert.equal(data.server, 'http://localhost/orga/myapp/');
      done();
    };

    stubFs.returns(false);
    mctCore.deploy(options).on('complete', handler);
  });

  it('deploy with error callback', function (done) {
    var options = {
      baseurl: 'error-case',
      rootPath: './path/to/myapp/'
    };

    var handler = function(err, data) {
      assert.ok(err);
      assert.ok(err.message, 'some-error');
      assert.equal(data, null);
      done();
    };

    mctCore.deploy(options).on('error', handler);
  });
});
