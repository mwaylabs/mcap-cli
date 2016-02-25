var Logger = require('../lib/logger');

var logger = new Logger({
    auth: {
        'user': '<USER>',
        'pass': '<PASS>'
    },
    baseUrl: 'http://localhost/'
});

logger.watch({
    name: 'javascript.applications.3785733C-B873-4D43-AC88-8CB5C38407EA&t=1408448540150'
}).then(function(){
    console.log('succ');
    console.log(arguments);
}, function(){
    console.log('error');
});

logger.output = function(log){
    if (log) {
        Object.keys(log).forEach(function (l) {
            console.log(log[l].message);
        });
    }
};

process.stdin.resume();
