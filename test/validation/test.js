'use strict';

/*jshint expr: true*/

var ApplicationValidation = require('../../lib/validation');
require('should');
var path = require('path');

describe('mcapApplicationValidation', function () {
  var validation;

  beforeEach(function() {
    process.chdir(path.resolve(__dirname, 'fixtures/'));
    validation = new ApplicationValidation();
  });

  it('unkown folder', function (cb) {
    validation.run('./unkown-folder', function(err) {
      err.should.be.defined;
      cb();
    });
  });

  it('not mcap project', function (cb) {
    validation.run('./no_project', function(err) {
      err.should.be.defined;
      err.message.should.be.eql('Missing mcap.json file');
      cb();
    });
  });

  it('lint errors', function (cb) {
    validation.run('./lint_error/', function(err) {
      err.should.be.defined;
      err.name.should.be.eql('LintError');
      err.details.should.be.defined;
      err.details.should.be.instanceOf(Array);
      err.details.should.be.length(2);
      err.details[0].should.be.type('object');
      err.details[0].file.should.be.type('string');
      err.details[0].message.should.be.type('string');
      cb();
    });
  });

  it('validation errors', function (cb) {
    validation.run('./validation_error/', function(err) {
      err.should.be.defined;
      err.name.should.be.eql('ValidateError');
      err.details.should.be.defined;
      err.details.should.be.instanceOf(Array);
      err.details.should.be.length(2);
      err.details[0].should.be.type('object');
      err.details[0].file.should.be.type('string');
      err.details[0].message.should.be.type('string');
      cb();
    });
  });

  it.skip('pass', function (cb) {
    validation.run('./passes/', function(err) {
      (err === null).should.be.true;
      cb();
    });
  });

  it('ignore', function (cb) {
    validation.run('./ignore/', function(err) {
      (err === null).should.be.true;
      cb();
    });
  });
});
