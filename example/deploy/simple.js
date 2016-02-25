/*
 * mcap-deploy
 * https://github.com/mwaylabs/mcap-deploy
 *
 * Copyright (c) 2014 mwaylabs
 * Licensed under the MIT license.
 */

'use strict';

var mcapDeploy = require('../');
var path = require('path');

var options = {
    baseurl: 'http://localhost',
    username: 'admin',
    password: 'password',
    rootPath: path.resolve(__dirname, '../test/fixtures/MyTestApp/'),
    progress: function(percent, chunkSize, totalSize){
        console.log(percent, chunkSize, totalSize);
    }
};

mcapDeploy.deploy(options).then(function(){
    console.log('succ uploaded');
    console.log(arguments);
}, function(err){
    console.log('something bad happend');
    console.log(JSON.stringify(err, null, ' '));
});
