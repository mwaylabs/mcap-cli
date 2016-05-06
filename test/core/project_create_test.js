'use strict';

var mctCore = require('../../lib/core');
var os = require('os');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var sinon = require('sinon');
var yeoman  = require('yeoman-generator');
var yo = require('../../lib/core/util/yo.js');
var GulpUtil = require('../../lib/core/util/gulp.js');
var helpers = yeoman.test;
var assert = yeoman.assert;
require('events').EventEmitter.prototype._maxListeners = 10000;

var executeYoStub = function(generatorName, options, cb) {
  var answers, subGen = [];

  if (generatorName === 'm') {
    options['skip-sdk'] = true;
    answers = {
      'appId': 'com.mwaysolutions.helloapp',
      'bowerPackages': [
        'angular-dynamic-locale#~0.1.17'
      ],
      'platforms': [
        'ios',
        'android'
      ],
      'plugins': [
        'org.apache.cordova.device'
      ]
    };
    subGen = [ // configure path to  subgenerators
      path.join(__dirname, '../node_modules/generator-m/module'),
      path.join(__dirname, '../node_modules/generator-m/constant'),
      path.join(__dirname, '../node_modules/generator-m/controller'),
      path.join(__dirname, '../node_modules/generator-m/template'),
      path.join(__dirname, '../node_modules/generator-m/service')

    ];
  }
  var DummyGen = {};
  helpers.run('generator-' + generatorName)
  .withPrompt(answers)
  .withOptions(options)
  .withGenerators(subGen)
  .on('end', cb);
  return DummyGen;
};

describe('.project.create()', function () {
  var stubExecuteYo;
  var stubExecuteGulp;
  this.timeout(60000);

  beforeEach(function(done) {

    stubExecuteYo = sinon.stub(yo.prototype, '_run', executeYoStub);
    stubExecuteGulp = sinon.stub(GulpUtil.prototype, '_run', function() {
      this.emit('exit', 0);
    });

    var dir = path.join(os.tmpdir(), './tmp');
    process.chdir('/');
    console.log(dir);
    rimraf(dir, function (err) {
      if (err) {
        return done(err);
      }
      mkdirp.sync(dir);
      process.chdir(dir);
      done();
    });
  });

  afterEach(function() {
    stubExecuteYo.restore();
    stubExecuteGulp.restore();
  });

  it('generate expected files', function (done) {
    mctCore.project.create({
      name: 'HalloApp',
      skipInstall: true
    }, function(err) {
      if (err) {
        return done(err);
      }

      var expectedFiles = [
        'mcap.json',
        'client/bower.json',
        'server/package.json'
      ];

      var unexpectedFiles = [
        'client/.gitignore',
        'client/.mcapignore',
        'client/.gitattributes',
        'server/.gitignore',
        'server/.mcapignore',
        'server/.gitattributes'
      ];

      var expectedContent = [
        ['mcap.json', /"name": "HalloApp"/],
        ['client/bower.json', /"name": "HalloApp"/],
        ['server/package.json', /"name": "HalloApp"/]
      ];

      assert.file(expectedFiles);
      assert.noFile(unexpectedFiles);
      assert.fileContent(expectedContent);
      done(err);
    });
  });

  it('return the project path', function (done) {
    mctCore.project.create({
      name: 'HalloApp',
      skipInstall: true
    }, function(err, projectSummary) {
      assert.ok(projectSummary.basePath.indexOf('HalloApp') > -1);
      done(err);
    });
  });
});
