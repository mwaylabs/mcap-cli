# mct-core 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]


## License

Copyright (c) 2014 M-Way Solutions GmbH. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/mct-core
[npm-image]: https://badge.fury.io/js/mct-core.svg
[travis-url]: https://travis-ci.org/mwaylabs/mct-core
[travis-image]: https://travis-ci.org/mwaylabs/mct-core.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mct-core.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mct-core
[coveralls-url]: https://coveralls.io/r/mwaylabs/mct-core
[coveralls-image]: https://coveralls.io/repos/mwaylabs/mct-core/badge.png


Commands
====

Legend
===
- mcap is always needed
- yo === yeoman global
- <generator> at the moment we have to available choices "m" or "server"
  yo:m view
  yo:server endpoint
- <state> is optional client or server

##Yo
````
  mcap
  mcap new <projectname>
  
  //view available gen commands https://github.com/mwaylabs/generator-m/blob/master/README.md
  mcap yo:<generator> view <view name>
  
  //view available gen commands https://github.com/mwaylabs/generator-m-server/blob/master/README.md
  mcap yo:server endpoint <endpoint name>
  
````

##Gulp

````
//start gulp default task client and server task
mcap gulp

//start gulp default on state
 mcap gulp:<state>
 
 //start gulp <task> on client and server
 mcap gulp watch
 
 //start gulp:<state> <task> on client
 mcap gulp:client watch
 
````

##CLI
````
  // create a model in client and server
  mcap model <modelname>
  mcap server
  mcap new
````
@todo
