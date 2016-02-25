# mcap-deploy 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

node.js implementation to deploy an app against the studio API.


## Install

```bash
$ npm install --save mcap-deploy
```

## Usage

```javascript
var options = {
    baseurl: '<URL>',
    username: '<USERNAME>',
    password: '<PASSWORD>',
    fields: {
        name: 'TestApp1',
        uuid: '5fc00ddc-292a-4084-8679-fa8a7fadf1db'
    },
    rootPath: path.resolve(__dirname, '../example/apps/MyTestApp'),
    progress: function(percent, chunkSize, totalSize){
        console.log(percent, chunkSize, totalSize);
    }
};
mcapDeploy.deploy(options/*, request*/).then(function(){
    console.log('succ uploaded');
    console.log(arguments);
}, function(){
    console.log('something bad happend');
    console.log(arguments);
});
```

## Ignore files

To ignore files just create a `.mcapignore` file inside the root of the deploy folder, like how git ignores files based on a .gitignore file.

**Example:**

```
log.txt
server/node_modules
```

[npm-url]: https://npmjs.org/package/mcap-deploy
[npm-image]: https://badge.fury.io/js/mcap-deploy.svg
[travis-url]: https://travis-ci.org/mwaylabs/mcap-deploy
[travis-image]: https://travis-ci.org/mwaylabs/mcap-deploy.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mcap-deploy.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mcap-deploy
[coveralls-url]: https://coveralls.io/r/mwaylabs/mcap-deploy
[coveralls-image]: https://coveralls.io/repos/mwaylabs/mcap-deploy/badge.png
