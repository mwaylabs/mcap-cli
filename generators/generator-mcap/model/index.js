'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var stringifyObject = require('stringify-object');
var types = [
  'Map',
  'String',
  'String Array',
  'Character',
  'Character Array',
  'Byte',
  'Byte Array',
  'Short',
  'Short Array',
  'Integer',
  'Integer Array',
  'Long',
  'Long Array',
  'BigInteger',
  'BigInteger Array',
  'BigDecimal',
  'BigDecimal Array',
  'Double',
  'Double Array',
  'Float',
  'Float Array',
  'Boolean',
  'Boolean Array',
  'File',
  'File Array',
  'Date',
  'Date Array',
  'Object',
  'Object Array',
  'Binary Data'
];
var validateLength = function (val) {
  return !!val.length;
};

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.attr = [];
    this.primaryKeyIsUndefined = true;
  },

  prompting: {
    model: function () {
      var done = this.async();
      var prompt = [{
        name: 'modelName',
        message: 'Name',
        validate: validateLength
      },
        {
          name: 'modelDescription',
          message: 'Description'
        }];

      this.prompt(prompt, function (answers) {
        this.name = answers.modelName;
        this.label = answers.modelLabel;
        this.description = answers.modelDescription;
        done();
      }.bind(this));
    },

    askAttributes: function () {
      var done = this.async();

      console.log(chalk.underline('Add an attribute for the model'));

      var prompt = [{
        name: 'name',
        message: 'Name',
        validate: validateLength
      }, {
        type: 'list',
        name: 'type',
        message: 'Type',
        choices: types
      }, {
        name: 'description',
        message: 'Description'
      }, {
        type: 'confirm',
        name: 'mandatory',
        message: 'Is mandatory',
        default: true
      }, {
        type: 'confirm',
        name: 'key',
        message: 'Primary key',
        default: false,
        when: function () {
          return this.primaryKeyIsUndefined;
        }.bind(this)
      },
        {
          type: 'confirm',
          name: 'addOneMore',
          message: 'Do you want to add another attribute',
          default: true
        }];

      this.prompt(prompt, function (answers) {
        if (answers.key === true) {
          this.primaryKeyIsUndefined = false;
        }
        this.attr.push(_.omit(answers, 'addOneMore'));
        if (answers.addOneMore) {
          return this.prompting.askAttributes.call(this);
        }
        done();

      }.bind(this));
    },

    confirm: function () {
      var done = this.async();

      var prompt = [{
        type: 'confirm',
        name: 'createFile',
        message: 'Is everything correct?',
        default: true
      }];

      console.log('Name: ' + this.name);
      console.log('Attributes: ' + stringifyObject(this.attr, {indent: '  '}));

      this.prompt(prompt, function (answers) {
        if (!answers.createFile) {
          process.exit(1);
        }
        done();

      }.bind(this));
    }
  },

  writing: function () {
    this.dest.mkdir('models');
    var filename = this._.slugify(this._.humanize(this.name)) + '.json';

    var content = {};
    content.name = this.name;
    content.label = this.name;
    content.description = this.description;
    content.attributes = this.attr.map(function (item) {
      return _.omit(item, 'modelName', 'modelLabel', 'modelDescription');
    });

    this.dest.write('models/' + filename, JSON.stringify(content, null, ' '));
  },

  prepareValues: function () {
    return {
      name: this.name,
      description: this.description,
      attributes: this.attr
    };
  }
});
