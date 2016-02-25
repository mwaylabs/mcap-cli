/*
 * mcap-log
 * https://github.com/mwaylabs/mcap-log
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var bunyan = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var userHome = require('user-home');
var argv = require('minimist')(process.argv);

// Bunyan is a simple and fast JSON logging library.
// Please take a closer look to the readme and sample
//  to see how Bunyan works and how powerful it is.
// https://github.com/trentm/node-bunyan

// A "stream" is Bunyan's name for an output for log messages.
// https://github.com/trentm/node-bunyan#streams
var streams = [];

// Pipe the logs in a file. The file is located in the
// user home directory.
var logPath = path.join(userHome, 'mcap-log.log');
streams.push({
  level: argv.loglevel || bunyan.TRACE,
  path: logPath
});

// Clean up log file.
// TODO: Implement rotating file
// https://github.com/trentm/node-bunyan#stream-type-rotating-file

if (fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, '');
}

// Prettify the stream for the console
var prettyStdOut = new PrettyStream({
  useColor: true,
  mode: function(time, level, name, host, src, msg, extras, details) {
    return util.format('mcap %s %s%s\n%s', level, msg, extras, details);
  }
});
prettyStdOut.pipe(process.stdout);

streams.push({
  level: argv.loglevel || bunyan.INFO,
  type: 'raw',
  stream: prettyStdOut
});

var log = bunyan.createLogger({

  // Give the logger the app name.
  name: 'mcap',

  // Log the source file, line and function name.
  // Therfore you should use named function
  // https://github.com/trentm/node-bunyan#src
  src: true,

  // Add the outputsgst
  streams: streams
});

// Advanced logging for our devs. Log logger errors.
if (argv.debug) {
  log.on('error', function (err) {
    console.warn('An error in bunyan occurred:', err);
  });
}

// Print some  information about the system
log.debug('Platform: %s', process.platform);
log.debug(process.versions, 'Versions:');

module.exports = log;
