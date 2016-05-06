var path    = require('path');
var os = require('os');
var yeoman  = require('yeoman-generator');
var helpers = yeoman.test;

/**
 * Helper to create a sub generator with the given params.
 *
 * @param  {String}   type Name of the sub generator
 * @param  {Object}   opt  Opitons for the generator
 * opt = {
 *   options: {},
 *   args: [],
 *   answers: {}
 * }
 * @param  {Function} cb   callback
 */
function createSubGenerator(type, opt, cb) {

  var deps = [
    [helpers.createDummyGenerator(), 'm-server:' + type]
  ];

  opt = opt || {};
  opt.args = opt.args || [];
  opt.options = opt.options || {};
  opt.answers = opt.answers || {};

  if (opt.options['skip-install'] === undefined) {
    opt.options['skip-install'] = true;
  }

  return helpers.run(path.join(__dirname, '../' + type))
    .withGenerators(deps)
    .withOptions(opt.options)
    .withArguments(opt.args)
    .withPrompt(opt.answers)
    .on('end', cb);
}

/**
 * Helper to create a generator with the given params.
 *
 * @param  {Object}   opt  Opitons for the generator
 * opt = {
 *   options: {},
 *   args: [],
 *   answers: {}
 * }
 * @param  {Function} cb   callback
 */
function createAppGenerator(opt, cb) {

  opt = opt || {};
  opt.args = opt.args || [];
  opt.options = opt.options || {};
  opt.answers = opt.answers || {};

  if (opt.options['skip-install'] === undefined) {
    opt.options['skip-install'] = true;
  }

  return helpers.run(path.join(__dirname, '../app'))
    .inDir(path.join(os.tmpdir(), './tmp'))
    .withOptions(opt.options)
    .withArguments(opt.args)
    .withPrompt(opt.answers)
    .on('end', cb);
}

// TODO remove this when pull request is merged
// https://github.com/yeoman/generator/pull/682
function regExpFromString(str) {
  return new RegExp(str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));
}

module.exports = {
  createAppGenerator: createAppGenerator,
  createSubGenerator: createSubGenerator,
  regExpFromString: regExpFromString
};
