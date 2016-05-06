var gulpFilter = require('gulp-filter');
var Joi = require('joi');

/**
 * Validate the mcap model files.
 * See joi documentation for more details
 *
 * @type {Object}
 */
module.exports = {
  filter: gulpFilter('models/*.json'),
  schema: Joi.object().keys({
    name: Joi.string().required().regex(/[a-zA-Z0-9_-]/).min(3).max(30),
    label: Joi.string().required().regex(/[a-zA-Z0-9_-]/).min(3).max(30),
    description: Joi.string().optional(),
    attributes: Joi.array().required()
  }),
  options: {
    allowUnknown: false
  }
};
