'use strict';

var mcapLog = require('../../lib/log');
var assert = require('should');

describe('mcapLog', function () {

  it('mcapLog.trace()', function () {
    mcapLog.trace().should.be.defined;
    mcapLog.trace().should.be.a.fucntion;
  });

  it('mcapLog.debug()', function () {
    mcapLog.debug().should.be.defined;
    mcapLog.debug().should.be.a.fucntion;
  });

  it('mcapLog.info()', function () {
    mcapLog.info().should.be.defined;
    mcapLog.info().should.be.a.fucntion;
  });

  it('mcapLog.warn()', function () {
    mcapLog.warn().should.be.defined;
    mcapLog.warn().should.be.a.fucntion;
  });

  it('mcapLog.error()', function () {
    mcapLog.error().should.be.defined;
    mcapLog.error().should.be.a.fucntion;
  });

  it('mcapLog.fatal()', function () {
    mcapLog.fatal().should.be.defined;
    mcapLog.fatal().should.be.a.fucntion;
  });

});
