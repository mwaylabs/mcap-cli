'use strict';

var checker = require('../../../lib/core/util/checker.js');
var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

describe('checker', function () {
  beforeEach(function(done) {
    var dir = path.join(os.tmpdir(), './tmp');
    process.chdir('/');
    rimraf(dir, function (err) {
      if (err) {
        return done(err);
      }
      mkdirp.sync(dir);
      process.chdir(dir);
      done();
    });
  });

  describe('.isValidProject', function() {
    it('is valid', function() {
      fs.writeFileSync('mcap.json', '');
      assert.equal(checker.isValidProject(), true);
    });

    it('is not valid', function() {
      assert.equal(checker.isValidProject(), false);
    });
  });
});
