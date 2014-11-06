'use strict';

module.exports = function () {

  this.prompt([{
    name: 'whatNext',
    type: 'list',
    message: 'Which compontent would you like to add?',
    choices: [{
      name: 'Model',
      value: {
        apiCall: 'model.create'
      }
    }]
  }], function (answer) {

    this._api(answer.whatNext.apiCall, answer.whatNext.args);

  }.bind(this));
};
