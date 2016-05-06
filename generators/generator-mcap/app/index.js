'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var async = require('async');
var yeoman = require('yeoman-generator');
var uuid = require('node-uuid');
var log = require('../../../lib/log');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    log.debug('generator-mcap is started');
    this.pkg = require('../package.json');

    this.uuid = uuid.v4();
    log.debug('Create project with uuid: %s', this.uuid);

    this.argument('name', {type: String, required: false});
    this.name = this.name || path.basename(process.cwd());
    this.name = this._.camelize(this._.slugify(this._.humanize(this.name)));
    this.baseAlias = '/' + this.name;
    this.clientDocument = this.clientDocument;
    this.serverDocument = this.serverDocument;
    this.directoryIndex = this.directoryIndex;
  },

  prompting: function () {
    var done = this.async();

    var prettyName = function (value) {
      return this._.camelize(this._.slugify(this._.humanize(value)));
    }.bind(this);

    var parseAnswers = function (answers) {
      this.name = answers.name.trim();
      this.baseAlias = '/' + answers.baseAlias.trim();
      this.clientDocument = answers.clientDocument;
      this.serverDocument = answers.serverDocument;
      this.directoryIndex = answers.directoryIndex;

      log.debug('Name: %s', this.name);
      log.debug('BaseAlias: %s', this.baseAlias);
      log.debug('ClientDocument: %s', this.clientDocument);
      log.debug('ServerDocument: %s', this.serverDocument);
      log.debug('DirectoryIndex: %s', this.directoryIndex);

      done();
    }.bind(this);

    // When name is set in options, skip prompting
    if (this.options.name) {
      return parseAnswers({
        name: this.options.name,
        baseAlias: prettyName(this.options.name)
      });
    }

    // Show prompt to get values from user input
    var prompts = [{
        name: 'name',
        message: 'Project name',
        validate: function (val) {
          return val.match(/^[a-zA-Z0-9]*$/) !== null ? true : 'Please enter a project name only a-zA-Z0-9 no whitespace';
        }
      }, {
        name: 'baseAlias',
        message: 'Base alias',
        default: function (props) {
          return prettyName(props.name);
        }.bind(this),
        validate: function (value) {
          return value.match(/^[/\w0-9-_]+$/) !== null ? true : 'Please enter a value without whitespace and special characters';
        }
      },
        {
          name: 'clientDocument',
          message: 'Client start Document',
          default: './client/www/',
          validate: function (value) {
            return value.match(/^([a-zA-Z]:)?(\\{2}|\/)?([a-zA-Z0-9\\s_@-^!#$%&+={}\[\]]+(\\{2}|\/)?)|(\.(js|html)+)?$/) !== null ? true : 'Please enter a valid path';
          }
        },
        {
          name: 'serverDocument',
          message: 'Server start Document',
          default: './server/app.js',
          validate: function (value) {
            return value.match(/^([a-zA-Z]:)?(\\{2}|\/)?([a-zA-Z0-9\\s_@-^!#$%&+={}\[\]]+(\\{2}|\/)?)|(\.(js|html)+)?$/) !== null ? true : 'Please enter a valid path';
          }
        },
        {
          type: 'list',
          name: 'directoryIndex',
          message: 'DirectoryIndex on/off',
          default: false,
          choices: [
            {
              value: false,
              name: 'no'
            },
            {
              value: true,
              name: 'yes'
            }
          ]
        }
      ];
    this.prompt(prompts, parseAnswers);
  },

// TODO move this function into a separate node module
  _getProjectFolderName: function (name, cb) {
    var names = [name];
    var seperator = '-';
    var max = 100;
    for (var i = 1; i < max; i++) {
      names.push(util.format('%s%s%s', name, seperator, i));
    }
    async.mapSeries(names, fs.stat, function (err) {
      cb(err.path);
    });
  },
  writing: {
    app: function () {
      var done = this.async();
      this._getProjectFolderName(this.name, function (projectFolder) {

        this.dest.mkdir(projectFolder);
        log.debug('Create project folder: %s', projectFolder);

        process.chdir(projectFolder);
        log.debug('Change directory to: %s', projectFolder);

        this.log.create(process.cwd());

        this.dest.mkdir('server');
        this.dest.mkdir('client');

        this.template('_mcap.json', 'mcap.json');
        this.template('_mcap.json','env/env-prod.json');
        this.template('_mcap.json', 'env/env-dev.json');
        this.dest.mkdir('env/assets');
        this.dest.mkdir('env/assets/dev');
        this.dest.mkdir('env/assets/prod');
        this.template('_gitkeep', 'env/assets/dev/.gitkeep');
        this.template('_gitkeep', 'env/assets/prod/.gitkeep');
        done();
      }.bind(this));
    },
    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('gitattributes', '.gitattributes');
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('mcapignore', '.mcapignore');
    }
  },
  end: function () {
    log.debug('generator-mcap is completed');
  }
});
