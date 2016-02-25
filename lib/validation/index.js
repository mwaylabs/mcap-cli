var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var jsonlint = require("gulp-jsonlint");
var validate = require('./tasks/validate');
var log = require('../log');

var mcapManifest = require('./validators/mcapManifest.js');
var mcapModels = require('./validators/mcapModels.js');
var defaultIgnore = ['!server/node_modules/**', '!client/node_modules/**', '!client/app/bower_components/**'];

var ApplicationValidation = function(options) {
  this.options = options || {};
  this.options.ignore = this.options.ignore || defaultIgnore;

  this.jsonLinstMessages = [];
  this.validateMessages = [];
  log.info('validate project...');
};

ApplicationValidation.prototype.setupGulp = function(projectRoot) {
  var that = this;

  // A custom json lint reporter which collect
  // all incoming warnings in an array.
  var jsonLintReporter = function (file) {
    that.jsonLinstMessages.push({
      file: file.relative,
      message: file.jsonlint.message
    });
  };

  // A custom valid reporter which collect
  // all incoming warnings in an array.
  var validateReporter = function (file) {
    that.validateMessages.push({
      file: file.relative,
      message: file.validate.message
    });
  };

  // Lint json files
  gulp.task('lint', function(cb) {
    log.debug('lint js files');
    return gulp.src(that.options.ignore.concat(['**/*.json']), {cwd:projectRoot})

      .pipe(jsonlint())
      .pipe(jsonlint.reporter(jsonLintReporter))

      .on('finish', function() {
        if (that.jsonLinstMessages.length) {
          var error = new Error();
          error.name = 'LintError';
          error.details = that.jsonLinstMessages;
          return cb(error);
        }
        cb(null);
      });
  });

  gulp.task('mcapManifest', ['lint'], function(cb) {
    log.debug('validation mcap files');
    return gulp.src(that.options.ignore.concat(['**/*.json']), {cwd:projectRoot})

      // Validate manifest file
      .pipe(mcapManifest.filter)
      .pipe(validate(mcapManifest))
      .pipe(validate.reporter(validateReporter))
      .pipe(mcapManifest.filter.restore())

      // Validate model files
      .pipe(mcapModels.filter)
      .pipe(validate(mcapModels))
      .pipe(validate.reporter(validateReporter))
      .pipe(mcapModels.filter.restore())

      .on('finish', function() {
        if (that.validateMessages.length) {
          var error = new Error();
          error.name = 'ValidateError';
          error.details = that.validateMessages;
          return cb(error);
        }
        cb(null);
      });
  });

  gulp.task('default', ['mcapManifest']);
};

/**
 * Run some validations on the given project folder.
 * If the folder does not contain a mcap.json file or
 * is not readable, the callback will called with the
 * error as first argument.
 *
 * @param  {String}   basePath Path to the mcap project
 * @param  {Function} cb       Callback
 */
ApplicationValidation.prototype.run = function(basePath, cb) {

  // Check if folder is present
  fs.stat(basePath, function(err) {
    if (err) {
      return cb(err);
    }

    // Check if folder contains a mcap.json file
    fs.stat(path.resolve(basePath, 'mcap.json'), function(err) {
      if (err) {
        if (err.code === 'ENOENT') {
          return cb(new Error('Missing mcap.json file'));
        }
        return cb(err);
      }

      // Start validation
      this.setupGulp(basePath);
      gulp.run('default', function(err) {
        if (err) {
          return cb(err);
        }

        log.debug('project validation done');

        // We are done, call the callback
        cb(null);
      });

    }.bind(this));
  }.bind(this));
};

module.exports = ApplicationValidation;
