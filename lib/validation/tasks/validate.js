
var _ = require('lodash');
var gutil = require('gulp-util');
var c = gutil.colors;
var Joi = require('joi');
var mapStream = require('map-stream');
var stripJsonComments = require('strip-json-comments');

/**
 * Custom gulp task to run joi.
 *
 * @param {Object} jobDescription The joi description
 * See https://github.com/hapijs/joi for details
 *
 * @example
 * {
 *   filter: gulpFilter('models/*.json'),
 *   schema: Joi.object().keys({
 *     name: Joi.string().required().alphanum().min(3).max(30),
 *     label: Joi.string().required().alphanum().min(3).max(30),
 *     attributes: Joi.array().required()
 *   }),
 *   options: {
 *     allowUnknown: false
 *   }
 * }
 */
var Validate = function(jobDescription) {
  return mapStream(function (file, cb) {
    var content = null;

    try {
      content = JSON.parse(stripJsonComments(String(file.contents)));
    } catch (err) {
      return cb(err);
    }

    var options = {
      abortEarly: false
    };

    _.defaults(options, jobDescription.options);

    // Setup joi with the given jobDescription
    Joi.validate(content, jobDescription.schema, options, function (err) {
      if (err) {
        file.validate = err;
        file.validate.success = false;
      }
      cb(null, file);
    }.bind(this));
  });
};

// Default reporter
// Prints the error to the console
var defaultReporter = function(file) {
  gutil.log(c.yellow('Error on file ') + c.magenta(file.path));
  gutil.log(c.red(file.validate));
};

/**
 * Returns the stream that reports stuff
 *
 * @param  {Function} customReporter Optional custom functon for reporting
 * @return {Stream}
 */
Validate.reporter = function (customReporter) {
  var reporter = defaultReporter;

  if (typeof customReporter === 'function') {
    reporter = customReporter;
  }

  return mapStream(function (file, cb) {
    if (file.validate && !file.validate.success) {
      reporter(file);
    }
    return cb(null, file);
  });
};

module.exports = Validate;
