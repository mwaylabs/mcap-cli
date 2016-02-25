var gulpFilter = require('gulp-filter');
var Joi = require('joi');

/**
 * Validate the mcap manifest files.
 * See joi documentation for more details
 *
 * @type {Object}
 */
module.exports = {
  filter: gulpFilter('mcap*.json'),
  schema: Joi.object().keys({
    name: Joi.string().required().regex(/[a-zA-Z0-9_-]/).min(3).max(30),
    uuid: Joi.string().required().regex(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/),
    baseAlias: Joi.string().required().regex(/^\//).min(3).max(30)
  }),
  options: {
    allowUnknown: true
  }
};
