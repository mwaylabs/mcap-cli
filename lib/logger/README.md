# mCAP Logger
Connect a logger against the mCAP Logger REST API with node

## Example

```
var Logger = require('mcap-logger');

var logger = new Logger({
    auth: {
        'user': '<USER>',
        'pass': '<PASS>'
    },
    baseUrl: '<SERVER URL>'
});

logger.watch({
    name: 'javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA'
}).then(function(){
    console.log('succ registered watcher');
}, function(){
    console.log('error');
});

// callback when a log happend
logger.output = function(log){
    if (log) {
        Object.keys(log).forEach(function (l) {
            console.log(log[l].message);
        });
    }
};

// stop watching
logger.unwatch();

```

## Test

```
npm test
```
or
```
mocha test
```