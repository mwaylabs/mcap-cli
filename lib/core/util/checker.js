/*
 * mct-core
 * https://github.com/mwaylabs/mct-core
 *
 * Copyright (c) 2014 M-Way Solutions GmbH
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var log = require('../../log');
var findup = require('findup-sync');

/**
 * Returns the project root path relative to the
 * current directory or the given cwd.
 *
 * @param  {String} cwd
 * @return {String}
 */
var getProjectRoot = function(cwd) {
  cwd = cwd || process.cwd();

  var projectRoot = findup('mcap.json', {cwd: cwd});
  if (projectRoot) {
    return path.dirname(projectRoot);
  }
  return null;
};

/**
 * Returns true if the cwd or the given path
 * contains a mcap.json file.
 *
 * @param  {String} cwd
 * @return {Boolean}
 */
var isValidProject = function(cwd) {
  cwd = cwd || process.cwd();

  var result = getProjectRoot(cwd);
  log.debug('Folder %s is%s a mcap project', cwd, result ? '' : ' NOT');
  if (result) {
    log.debug('Found mcap.json at location %s', result);
  }

  return result !== null;
};

module.exports = {
  isValidProject: isValidProject,
  getProjectRoot: getProjectRoot
};
