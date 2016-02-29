'use strict';

var yeoman = require('yeoman-generator');

var validateLength = function (val) {
  return !!val.length;
};

var validateURL = function (val) {
  return !!val.match(/(http|https):\/\/[\w-]+(\.[\w-]+)|(\:[0-9])([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/);
};

module.exports = yeoman.generators.Base.extend({

  prompting: function () {
    var done = this.async();

    var prompt = [{
      name: 'name',
      message: 'Name',
      validate: validateLength
    }, {
      name: 'description',
      message: 'Description'
    }, {
      name: 'descriptorUrl',
      message: 'Descriptor URL',
      validate: validateURL
    }, {
      name: 'username',
      message: 'Username',
      validate: validateLength
    }, {
      type: 'password',
      name: 'password',
      message: 'Password',
      validate: validateLength
    }];

    this.prompt(prompt, function (answers) {
      this.answers = answers;
      done();
    }.bind(this));
  },

  writing: function () {
    this.dest.mkdir('connections');
    var filename = this._.slugify(this._.humanize(this.answers.name)) + '.json';

    var content = {
      name: this.answers.name,
      description: this.answers.description,
      type: 'rest',
      properties: {
        descriptorUrl: this.answers.descriptorUrl,
        username: this.answers.username,
        password: this.answers.password
      }
    };

    this.dest.write('connections/' + filename, JSON.stringify(content, null, ' '));
  }
});
