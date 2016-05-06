/**
 * Created by Thomas Beckmann on 02/26/16.
 */
'use strict';
var chalk = require('chalk');
var figures = require('figures');
var inquirer = require('inquirer');
var serverconfig = require('../../rc');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

/**
 * config
 * @type {*[]}
 */
var config = [
  {
    type    : 'list',
    name    : 'server',
    message : 'Choose server',
	choices	: function () {
	  return Object.keys(serverconfig.list().server).map(function (server) {
	    return { 'name': server };
	  })
    }
  },
  {
	type	: 'input',
	name	: 'pfx',
	message	: 'Client Certificate',
	default	: null,
	validate: function (value) {
	  if (value && path.isAbsolute(value)) {
		try {
		  fs.readFileSync(value);
		} catch(x) {
		  return x.message;
		}
	  }
	  return true;
	}
  },
  {
	type	: 'password',
	name	: 'passphrase',
	message	: 'Enter the Passphrase',
	when	: function (answers) {
	  return !!answers.pfx;
	}
  }
];

/**
 * configure client certificate of a server.
 */
module.exports = function clientcert() {
  if (config[0].choices().length <= 0) {
    console.log(chalk.cyan(figures.warning), chalk.yellow('Your Server list is empty.'));
    return;
  }

  return inquirer.prompt(
    config,
    function (answers) {
	  return serverconfig.parse('clientcert', [ answers.server, answers.pfx, answers.passphrase ]);
    }
  );
};
