'use strict';
var _ = require('lodash');
var eventBus = require('../util/eventbus.js');
// Commands Plugins
var plugins = [
  require('./create-project'),
  require('./server')
];
module.exports = function() {
  _.each(plugins,function(plugin){
    eventBus.on(eventBus.CMD_EVENT, plugin);
  });
};
