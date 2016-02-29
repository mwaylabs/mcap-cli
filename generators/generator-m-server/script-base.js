'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var utils = require('./util.js');
var chalk = require('chalk');
var _ = require('lodash');
/**
 * set the model the assigned primarykey
 * @param arguments
 * @returns {*}
 */
var _setPrimaryKey = function (primaryKey) {
  if(!_.isUndefined(primaryKey)){
    return primaryKey;
  }
  return '_id';
};

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  // Get the app name form package.json or cwd folder name
  try {
    this.appname = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);
  /**
   * @dexcription use command "yo m-server:bikini <name> <primaryKey>"
   * @property primaryKey
   * @type {*}
   * @example ````
   * this.args: Array[2]
     0: "Blubb"
     1: "_uuid"
   ```
   */
  this.primaryKey = _setPrimaryKey(this.args[1]);

  // Get root path to the app
  if (typeof this.env.options.appPath === 'undefined') {
    this.env.options.appPath = this.env.options.appPath || '';
    this.options.appPath = this.env.options.appPath;
  }

  // Define the template location
  var sourceRoot = '/templates/';
  this.sourceRoot(path.join(__dirname, sourceRoot));
};

util.inherits(Generator, yeoman.generators.NamedBase);

// Copy template
Generator.prototype.appTemplate = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + '.js',
    path.join(this.env.options.appPath, dest.toLowerCase()) + '.js'
  ]);
};


// Add requirete statement to the app.js
Generator.prototype.addRequireToApp = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'app.js');
    utils.rewriteFile({
      file: fullPath,

      // Anchor
      needle: '//build::require',

      // Content to insert
      splicable: [
        'var ' + this.name + ' = require(\'./' + script.toLowerCase().replace(/\\/g, '/') + '.js\');'
      ]
    });
  } catch (e) {
    this.log.error(chalk.yellow(
      '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
    ));
  }
};

Generator.prototype.addMiddlewareToApp = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'app.js');
    utils.rewriteFile({
      file: fullPath,

      // Anchor
      needle: '//build::middleware',

      // Content to insert
      splicable: [
        'app.use(\'/' + this.name.toLowerCase() + '\', ' + this.name + ');'
      ]
    });
  } catch (e) {
    this.log.error(chalk.yellow(
      '\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
    ));
  }
};

Generator.prototype.generateSourceAndTest = function (appTemplate, targetDirectory, skipAdd) {

  // Copy template to the users app
  this.appTemplate(appTemplate, path.join(targetDirectory, this.name));

  if (!skipAdd) {
    // Inject express code
    this.addRequireToApp(path.join(targetDirectory, this.name));
    this.addMiddlewareToApp(path.join(targetDirectory, this.name));
  }
};
