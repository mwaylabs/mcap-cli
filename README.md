# mCAP CLI
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Commandline Interface to generate mCAP Applications



## Install

```
gem install sass -v 3.4.5
bower i -g
git clone -b master https://github.com/mwaylabs/mcap-cli
cd mcap-cli
npm link
```

## Update

To get the latest updates run `npm update` in the `mcap-cli` directory.



## Usage

Just run `mcap` in your command line



### Commands

Usage:
```
mcap [--version] [--help] [--loglevel=<level>]
```

The most commonly used mcap commands are:
```
new           # Create a new mCAP project
help          # Show helpful resources to work with the mCAP
server
  add         # Add a new server
  remove      # Remove a specific server
  list        # Show all configured servers
component
  model       # Add a new model
```



## Debug

By setting the loglevel, you can easily follow the programm flow. The levels are: trace, debug, info, warn, error, and fatal.

- "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
- "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
- "warn" (40): A note on something that should probably be looked at by an operator eventually.
- "info" (30): Detail on regular operation.
- "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
- "trace" (10): Logging from external libraries used by your app or very detailed application logging.

```
mcap <command> --loglevel=trace
```



##Yo

> This feature is not implemented yet

````
//create a view in your client folder
mcap yo:<generator> view <view name>

//create an Endpoint to your server folder
mcap yo:server endpoint <endpoint name>
````



##Gulp

> This feature is not implemented yet

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
