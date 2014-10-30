# mCAP CLI
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Commandline Interface to generate mCAP Applications



## Install

```
git clone https://github.com/mwaylabs/mcap-cli.git
cd mcap-cli
npm install
npm link
```



## Usage

Just run `mcap` in your command line

![mcap](https://lh3.googleusercontent.com/D7Vz2DFVRk3LCbjrCmVIKcY0qLG7jxIvPVgcd24x5SPt2YXGhot3Job0qkRr39ioU0yqig=w1896-h914)
Commands
====

Legend
===
- mcap is always needed
- yo === yeoman global
- <% generator %> at the moment we have two available choices "m" or "server"
  yo:m view
  yo:server endpoint
- <% state %> is optional client or server

##CLI
````
  // create a model in client and server
  mcap model <modelname>
  mcap server
  mcap new
````

##Yo
````
   //create a view in your client folder
  mcap yo:<generator> view <view name>
  
  //create an Endpoint to your server folder
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



##Generator

- generator-m https://github.com/mwaylabs/generator-m
- generator-m-server https://github.com/mwaylabs/generator-m-server


##License

Copyright (c) 2014 M-Way Solutions GmbH. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/mcap-cli
[npm-image]: https://badge.fury.io/js/mcap-cli.svg
[travis-url]: https://travis-ci.org/mwaylabs/mcap-cli
[travis-image]: https://travis-ci.org/mwaylabs/mcap-cli.svg?branch=master
[daviddm-url]: https://david-dm.org/mwaylabs/mcap-cli.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/mwaylabs/mcap-cli
[coveralls-url]: https://coveralls.io/r/mwaylabs/mcap-cli
[coveralls-image]: https://coveralls.io/repos/mwaylabs/mcap-cli/badge.png
