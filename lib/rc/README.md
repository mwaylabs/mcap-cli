# mCAP Serverconfig
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

Interface to configure multiple mCAP server.

## Install

```
npm install mcaprc
```

## Usage

```
var mcaprc = require('mcaprc');
// list all server
mcaprc.list();
// add a server
mcaprc.add(['name', 'baseurl', 'username', 'password']);
// set the default server
mcaprc.setDefault('name');
// remove a server
mcaprc.remove('name');
```

## Test

```
npm test
```

[npm-url]: https://npmjs.org/package/mcaprc
[npm-image]: https://badge.fury.io/js/mcaprc.svg
[travis-url]: https://travis-ci.org/mwaylabs/mcaprc
[travis-image]: https://travis-ci.org/mwaylabs/mcaprc.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mcaprc.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mcaprc
