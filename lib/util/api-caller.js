'use strict';

var debug = require('debug')('mway:mcap-cli:util:api-caller');
var _ = require('lodash');
var mctCore = require('mct-core');

module.exports = function(api, args) {

  if (args) {
    debug('Try to call %s(%s)', api, args.join(', '));
  } else {
    debug('Try to call %s()', api);
  }

  var caller = mctCore;
  api.split('.').forEach(function(method) {
    if (caller) {
      caller = caller[method];
    }
  });

  if (!_.isFunction(caller)) {
    return debug('Can not call api from string %s', api);
  }

  caller.apply(this, args);
};
