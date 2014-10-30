'use strict';

var eventBus = require('../util/eventbus.js');

// Commands
var createProject = require('./create-project');

module.exports = function() {

  // Register commands on the event bus.
  // The first argument `data` looks like
  // {
  //  "cmd": "new",
  //  "args": [
  //   "myProject"
  //  ],
  //  "opts": {
  //   "skip-install": true
  //  }
  // }
  eventBus.on(eventBus.CMD_EVENT, createProject);
};
