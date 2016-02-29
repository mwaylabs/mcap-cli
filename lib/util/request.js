'use strict';
/**
 * @file utils/request.js
 * Relution CLI
 *
 * Created by Thomas Beckmann on 29.02.2016
 * Copyright (c)
 * 2016
 * M-Way Solutions GmbH. All rights reserved.
 * http://www.mwaysolutions.com
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var assert = require('assert');
var formdata_ = require('node-formdata');
var fs = require('fs');
var path = require('path');
var request_ = require('request');
var url = require('url');

var checker = require('../core/util/checker.js');
var rc = require('../rc');

/**
 * module providing request and formdata APIs.
 *
 * <p>
 * This module provides wrappers used to configure authentication and client certificate
 * when talking to a server.
 * </p>
 */
module.exports = {

  configure: function configure(options) {
    if (typeof options.server === 'string') {
      // load server configuration
      options.server = rc.get(options.server);
    }

    if (typeof options.server === 'object') {
      console.log(options.url);
      if (options.server.baseurl) {
        var baseurl = options.server.baseurl;
        if (baseurl.substr(baseurl.length - 1) !== '/') {
          baseurl += '/';
        }
        assert(options.url[0] !== '/');
        options.url = url.resolve(baseurl, options.url);
      }

      if (options.server.username) {
        options.auth = {
          user: options.server.username,
          pass: options.server.password
        };
      }

      if (options.server.pfx) {
        if (typeof options.server.pfx === 'string') {
          options.server.pfx = fs.readFileSync(path.resolve(checker.getProjectRoot(), options.pfx));
        }
        options.pfx = options.server.pfx;
        options.passphrase = options.server.passphrase;
      }
    }

    return options;
  },

  request: function request(options) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = module.exports.configure(options);
    return request_.apply(this, args);
  },

  formdata: function formdata(options) {
    return formdata_(module.exports.configure(options), request_);
  }

};
