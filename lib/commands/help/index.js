'use strict';

var opn = require('opn');
var menuEntries = [
  {
    name: 'Take me to the documentation',
    value: 'https://wiki.mwaysolutions.com/confluence/display/mCAP/Home'
  },
  {
    name: 'Show Commands',
    value: {
      method: '_printhelp'
    }
  },
  {
    name: 'File an issue on GitHub',
    value: 'http://github.com/mwaylabs/mcap-cli'
  },
  {
    name: 'Take me back home',
    value: {
      method: '_home'
    }
  }
];

module.exports = function () {

  this.prompt([{
    name: 'whereTo',
    type: 'list',
    message: 'Here are a few helpful resources.\n' +
    '\nI will open the link you select in your browser for you',
    choices: menuEntries
  }], function (answer) {
    if (this._.isFunction(this[answer.whereTo.method])) {
      this[answer.whereTo.method]();
    } else {
      opn(answer.whereTo);
    }
  }.bind(this));
};
