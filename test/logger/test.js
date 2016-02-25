var assert = require('assert');
var expect = require('chai').expect;
var Logger = require('../../lib/logger');
var sinon = require('sinon');
var request = require('request');

var getLoggerInformationResponse = function (cb) {
    var data = {'name': 'javascript', 'level': 3, 'appenders': [], 'tags': [], 'effectiveLevel': 'INFO', 'inheritedAppenders': ['LiveLogAppender'], 'createdDate': 1404830511000, 'modifiedDate': 1408364335000, 'createdUser': '0f906ab8-e3e7-4f58-aa56-16ec503c97ce', 'modifiedUser': '76cef5ae-f64c-4a4a-a663-431dc1ae5274', 'version': 180, 'effectivePermissions': '*'};
    cb(null, null, data);
};

var getLogMessageResponse = function (cb) {
    var data = [
        {'id': null, 'date': 1408453914184, 'logger': 'javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA.server.lala.js', 'level': 20000, 'message': 'Hello World', 'extraFieldsMap': {'user': null}, 'setProperties': ['message', 'level', 'extraFieldsMap', 'logger', 'date']}
    ];
    cb(null, null, data);
};

var getRegisterLoggerResponse = function (cb) {
    cb(null, null, '791015ed-3cff-4ccf-b305-b0791252900f');
};

describe('Objects and Instances', function () {

    beforeEach(function () {
        sinon.stub(request, 'get', function (params, cb) {
            if (params.url.indexOf('/gofer/loggerConfiguration/rest/logger/loggerConfigurations') >= 0) {
                return getLoggerInformationResponse(cb);
            } else if (params.url.indexOf('gofer/system/liveLog?level=5000&logger=javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA') >= 0) {
                return getRegisterLoggerResponse(cb);
            } else if (params.url.indexOf('gofer/system/liveLog') >= 0) {
                return getLogMessageResponse(cb);
            } else {
                cb(true);
            }
        });
    });

    afterEach(function () {
        request.get.restore();
    });

    describe('Constructor', function () {
        it('should throw an error', function () {
            assert.throws(function () {
                new Logger();
            }, Error, 'Error thrown');

            assert.throws(function () {
                new Logger({});
            }, Error, 'Error thrown');

            assert.throws(function () {
                new Logger({
                    baseUrl: ''
                });
            }, Error, 'Error thrown');

            assert.throws(function () {
                new Logger({
                    baseUrl: 'http://localhost',
                    onError: {}
                });
            }, Error, 'Error thrown');

            assert.throws(function () {
                new Logger({
                    baseUrl: 'http://localhost',
                    onError: {},
                    output: {}
                });
            }, Error, 'Error thrown');

            assert.throws(function () {
                new Logger({
                    baseUrl: 'http://localhost',
                    output: {}
                });
            }, Error, 'Error thrown');

            var logger = new Logger({
                baseUrl: 'http://localhost'
            });
            assert.ok(logger);
            logger = new Logger({
                baseUrl: 'http://localhost',
                onError: function () {

                }
            });
            assert.ok(logger);
            logger = new Logger({
                baseUrl: 'http://localhost',
                onError: function () {
                    return true;
                },
                output: function () {
                    return true;
                }
            });
            assert.ok(logger);
            assert.ok(logger.onError() === true);
            assert.ok(logger.output() === true);
        });
    });

    describe('isWatching', function () {
        it('should be false', function () {
            var logger = new Logger({
                baseUrl: 'http://localhost',
                onError: function () {
                    return true;
                },
                output: function () {
                    return true;
                }
            });
            assert.ok(logger.isWatching() === false);
        });
    });

    describe('unWatch', function () {
        it('should reset to false', function () {
            var logger = new Logger({
                baseUrl: 'http://localhost',
                onError: function () {
                    return true;
                },
                output: function () {
                    return true;
                }
            });
            logger.unWatch();
            assert.ok(logger.isWatching() === false);
            assert.ok(logger.watching === false);
        });
    });

    describe('getLoggerInformation', function () {
        it('should send a request', function (done) {
            var logger = new Logger({
                baseUrl: 'http://localhost'
            });
            logger.getLoggerInformation().then(function (data) {
                expect(data.name).to.equal('javascript');
                done();
            });
        });
    });

    describe('registerLogger', function () {
        it('should call error', function (done) {
            var logger = new Logger({
                baseUrl: 'http://localhost'
            });
            logger.registerLogger().then(function () {
            }, function () {
                done();
            });
        });

        it('should call request', function (done) {
            var logger = new Logger({
                baseUrl: 'http://localhost'
            });
            logger.registerLogger({
                'name': 'javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA&t=1408448540150',
                'filePath': ''
            }).then(function (data) {
                expect(data).to.equal('791015ed-3cff-4ccf-b305-b0791252900f');
                done();
            }, function () {
            });
        });

    });

    describe('watch', function () {
        it('should call output and then unregister', function (done) {
            var logger = new Logger({
                baseUrl: 'http://localhost',
                output: function (data) {
                    expect(data[0].message).to.equal('Hello World');
                    expect(logger.isWatching()).to.equal(true);
                    logger.unWatch();
                    expect(logger.isWatching()).to.equal(false);
                    done();
                }
            });

            logger.watch({
                name: 'javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA&t=1408448540150'
            });
        });

        it('should call output multiple times', function (done) {
            var count = 0;
            var logger = new Logger({
                baseUrl: 'http://localhost',
                output: function (data) {
                    expect(data[0].message).to.equal('Hello World');
                    count += 1;
                    if (count > 3) {
                        expect(logger.isWatching()).to.equal(true);
                        logger.unWatch();
                        expect(logger.isWatching()).to.equal(false);
                        done();
                    }

                }
            });

            logger.watch({
                name: 'javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA&t=1408448540150'
            });
        });
    });

});
