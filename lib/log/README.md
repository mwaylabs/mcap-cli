# mcap-log 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

The logging lib for mcap tooling


## Install

```bash
$ npm install --save mcap-log
```


## Usage

```javascript
var mcapLog = require('mcap-log');
mcapLog.info('Hello %s', 'Volker');
```

## API

This module is just a tiny wrapper around bunyan. Please take a closer look to the bunyan [documentations](https://github.com/trentm/node-bunyan).


## License

Copyright (c) 2014. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/mcap-log
[npm-image]: https://badge.fury.io/js/mcap-log.svg
[travis-url]: https://travis-ci.org/mwaylabs/mcap-log
[travis-image]: https://travis-ci.org/mwaylabs/mcap-log.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mcap-log.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mcap-log
