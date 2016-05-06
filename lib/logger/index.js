var request = require('../util/request.js');
var Q = require('q');
var _ = require('lodash');
var assert = require('assert');

function Logger(options) {
    assert(options, 'Missing parameter options');
    assert(options.server, 'Missing parameter options.server');
    if (typeof options.onError !== 'undefined') {
        assert(typeof options.onError === 'function', 'Wrong parameter type: options.onError should be a function');
    }

    if (typeof options.output !== 'undefined') {
        assert(typeof options.output === 'function', 'Wrong parameter type: options.output should be a function');
        this.output = options.output;
    }
    this.server = options.server;
    // Revers API
    this.onError = options.onError || function () {
    };
}

// CONST if the longpolling raises an error
Logger.prototype.LONG_POLLING_ERROR = 'longpollingerror';

// the server
Logger.prototype.server = null;

// the XHR Object for the long polling log
Logger.prototype.longPollingXhr = null;

// if is set to true every log will send a long poll call again to wait for the next log - endless loop!
Logger.prototype.watching = true;
// the current logger id
Logger.prototype.loggerId = null;
// determines if the logger is watching or not
Logger.prototype._isWatching = false;

/**
 * The default output - set this via watch options: output
 * @param log
 */
Logger.prototype.output = function (log) {
    if (log) {
        Object.keys(log).forEach(function (l) {
            console.log(log[l].message);
        });
    }
};

/**
 * The default output - set this via watch options: output
 * @param log
 */
Logger.prototype.isWatching = function () {
    return this._isWatching;
};

/**
 * Stop the live logger
 */
Logger.prototype.unWatch = function () {
    this.watching = false;
    this._isWatching = false;
    if (this.longPollingXhr) {
        if (typeof this.longPollingXhr.abort === 'function') {
            this.longPollingXhr.abort();
        }
        else {
//            console.info(JSON.stringify(this.longPollingXhr));
        }
    }
};

/**
 * Start watching a live logger. Will stop every other live logger before.
 * options:
 * once: only wait until the first log has a response. Do not catch further logs
 * filePath: the path to the mCAP file to watch
 * output: a function the logs are send to - default is console.log
 * name: the name of the logger: default is ''
 * @example
 *
 * Logger.watch({
        filePath: 'applications/A1600A9A-249A-45A4-8D02-EA17D7B70805/server/test.js',
        output: function(message){
            console.log(message);
        }
      })
 *
 * @param options
 * @returns {*}
 */
Logger.prototype.watch = function (options) {

    var that = this;

    // resolve if there is already a watch task registered
    if (this.isWatching()) {
        var dfd = Q.defer();
        dfd.resolve();
        return dfd.promise;
    }

    // make sure options are available
    options = options || {};
    // make sure filePath is set
    options.filePath = options.filePath || '';

    // make sure filePath is set
    that.watching = options.once || true;

    that._isWatching = true;

    that.output = typeof options.output === 'function' ? options.output : that.output;
    // get the logger information
    return that.getLoggerInformation(options.name).then(function (loggerInformations) {
        // set the name of the logger should be the same
        var name = loggerInformations.name || options.name;
        var filter = options.filter ? '.' + options.filter : '';
        options.name = name + filter;
        // if the logger information was successful, register the logger
        return that.registerLogger(options);
    }, function (err) {
        var dfd = Q.defer();
        dfd.reject(err);
        return dfd.promise;
    }).then(function (uuid) {
        // register the logger returns the logger uuid
        that.loggerId = uuid;
        // poll for the first output
        return that.poll(uuid);
    }).then(function (log) {
        // if the poll was successfull log the response to the output
        return that._log(log);
    }).catch(function () {
        that.output(arguments);
    });
};

/**
 * Logs the response from the logger, if watching is set to true keep watching after the log
 * @param log
 * @returns {*}
 * @private
 */
Logger.prototype._log = function (log) {
    var dfd = Q.defer();
    if (this.watching) {
        this.poll(this.loggerId);
    }
    this.output(log);
    dfd.resolve(log);
    return dfd.promise;
};

/**
 * Requests a logger output to the given logger uuid
 * @param uuid
 * @returns {*}
 */
Logger.prototype.poll = function (uuid) {
    var dfd = Q.defer();
    var that = this;
    //        https://core.dev4.mwaysolutions.com/gofer/system/liveLog?uuid=b5ebfda4-54d9-4c5c-8cf7-34ba1aa8a23a
    if (!uuid) {
        dfd.reject('uuid is not set');
    }
    this.longPollingXhr = this._request({
        server: this.server,
        url: 'gofer/system/liveLog?uuid=' + uuid,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json'
    });

    // call the longpolling
    this.longPollingXhr.then(function (log) {
        // log if everything was ok
        that._log(log);
    }).catch(function (err) {
        // call the reverse api
        this.onError(Logger.prototype.LONG_POLLING_ERROR, err);
    });

    dfd.resolve();
    return dfd.promise;
};

var TRACE = 5000;
var DEBUG = 10000;
var INFO = 20000;
var WARN = 30000;
var ERROR = 40000;
var FATAL = 50000;

var levelFromName = {
    'trace': TRACE,
    'debug': DEBUG,
    'info': INFO,
    'warn': WARN,
    'error': ERROR,
    'fatal': FATAL
};

/**
 * Resolve a level number, name (upper or lowercase) to a level number value.
 */
function resolveLevel(nameOrNum) {
    if (typeof nameOrNum === 'string') {
        return levelFromName[nameOrNum.toLowerCase()] || TRACE;
    } else {
        return nameOrNum;
    }
}

/**
 * Resolve a level string, name (upper or lowercase) to a level number value.
 */
function getNameFromLevel(num) {
    return _.invert(levelFromName)[num];
}

/**
 * Register the mCAP logger
 * once: only wait until the first log has a response. Do not catch further logs
 * filePath: the path to the mCAP file to watch
 * output: a function the logs are send to - default is console.log
 * name: the name of the logger: default is ''
 * level: the log level: default is 20000
 * Log Level Overview:
 FATAL: 50000
 ERROR: 40000
 WARN: 30000
 INFO: 20000
 DEBUG: 10000
 TRACE: 5000
 *
 * @param options
 * @returns {*}
 */
Logger.prototype.registerLogger = function (options) {
    //        https://core.dev4.mwaysolutions.com/gofer/system/liveLog?level=20000&logger=javascript.applications.D5B31E37-0C67-4F57-BC74-98FF587C0A41.server.app.js
    //        https://core.dev4.mwaysolutions.com/gofer/system/liveLog?level=undefined&logger=javascript..applications.A1600A9A-249A-45A4-8D02-EA17D7B70805.server.test.js&t=1396607548520

    // if no filePath is set reject the promise
    if (!options || typeof options.filePath === 'undefined') {
        var dfd = Q.defer();
        dfd.reject('filePath is not set');
        return dfd.promise;
    }

    // the mCAP endpoint
    var url = 'gofer/system/liveLog?';
    // the log level
    var level = typeof options.level !== 'undefined' ? resolveLevel(options.level) : TRACE;
    url += 'level=' + level;
    // the name of the logger
    var name = typeof options.name !== 'undefined' ? options.name : '';
    // the file of the logger;
    var filePath = typeof options.filePath !== 'undefined' ? options.filePath : '';

    // build the url
    url += '&logger=' + name + filePath.replace(/\//g, '.');

    // do the register request
    return this._request({
      server: this.server,
      url: url,
        method: 'GET'
    });
};

/**
 * Get the logger information to the given name. Default is emptystring
 * @param name
 * @returns {*}
 */
Logger.prototype.getLoggerInformation = function (name) {
    //        https://core.dev4.mwaysolutions.com/gofer/loggerConfiguration/rest/logger/loggerConfigurations/javascript?computeDerived=true
    name = typeof name !== 'undefined' ? name : '';
    return this._request({
      server: this.server,
        url: 'gofer/loggerConfiguration/rest/logger/loggerConfigurations/' + name + '?computeDerived=true',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json'
    });
};

Logger.prototype._request = function (options) {
    var dfd = Q.defer();
    options.headers = options.headers || {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    };

    if (this.auth) {
        options.auth = this.auth;
    }

    request.request(options, function (error, response, body) {
        if (error) {
            dfd.reject(error);
            return;
        }
        var data = body;
        try {
            data = JSON.parse(body);
        } catch (e) {

        }
        dfd.resolve(data);
    });
    return dfd.promise;
};

module.exports = Logger;

module.exports.TRACE = TRACE;
module.exports.DEBUG = DEBUG;
module.exports.INFO = INFO;
module.exports.WARN = WARN;
module.exports.ERROR = ERROR;
module.exports.FATAL = FATAL;
module.exports.resolveLevel = resolveLevel;
module.exports.getNameFromLevel = getNameFromLevel;
