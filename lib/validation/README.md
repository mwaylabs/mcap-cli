# mcap-application-validation 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Validate a mCAP application


## Install

```bash
$ npm install --save mcap-application-validation
```


## Usage

```javascript

var ApplicationValidation = require('mcap-application-validation');

var validation = new ApplicationValidation();
validation.run('./test/fixtures/passes', function(err) {
  if (err) {
    return console.log(err.details);
  }
  console.log('Project is valid!');
});
```

## License

Copyright (c) 2014 M-Way Solutions GmbH. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/mcap-application-validation
[npm-image]: https://badge.fury.io/js/mcap-application-validation.svg
[travis-url]: https://travis-ci.org/mwaylabs/mcap-application-validation
[travis-image]: https://travis-ci.org/mwaylabs/mcap-application-validation.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mcap-application-validation.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mcap-application-validation
[coveralls-url]: https://coveralls.io/r/mwaylabs/mcap-application-validation
[coveralls-image]: https://coveralls.io/repos/mwaylabs/mcap-application-validation/badge.png
