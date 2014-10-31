'use strict';
var _ = require('lodash');
var mcapApplicationValidation = require('mcap-application-validation');
var path = require('path');
var chalk = require('chalk');
var bar = require('progress-bar');
var mcaprc = require('mcaprc');
var mctCore = require('mct-core');

/**
 *
 * @type {{
 *  progress: null,
 *  baseurl: string,
 *  baseAlias: string,
 *  username: string,
 *  password: string,
 *  rootPath: string,
 *  fields: {
 *    name: string,
 *    uuid: string
 *  }
 * }}
 */
var modelUpload = {
  progress : null,
  baseurl  : '',
  baseAlias: '',
  username : '',
  password : '',
  rootPath : '',
  fields   : {
    name: '',
    uuid: ''
  }

};
/**
 * return the default server from the json file
 * @returns {*}
 */
var getDefaultServer = function (args) {
  if ( args.length > 1 ) {
    return mcaprc.get(args[ 1 ]);
  } else {
    return mcaprc.get(mcaprc.default_server);
  }
};

/**
 *
 * @returns {*}
 */
var getProjectDir = function () {
  return process.cwd();
};

/**
 *
 * @returns {*}
 */
var getMcapJson = function () {
  try {
    return require(path.resolve(getProjectDir(), 'mcap.json'));
  } catch ( e ) {
    return false;
  }
};

/**
 *
 * @param dir
 * @returns {boolean}
 */
var validateProjectStructure = function () {
  var validation = mcapApplicationValidation.validate(getProjectDir());
  if ( validation )
    return true;
  return false;
};

/**
 * if the user is not in Project Folder
 */
var notInProject = function () {
  console.log(chalk.red('Looks Like you are not in a project Root Folder or your mcap.json is not available'));
};

/**
 * not mcap Project Structure
 */
var notValideProject = function () {
  console.log(chalk.red('Your Project is not a mCAP Project'));
};

/**
 *
 * @returns {process.stdout}
 */
var getProcessBar = function () {
  var _bar = bar.create(process.stdout);
  _bar.format = '$bar; $percentage,2:0;% uploaded.';
  _bar.symbols.loaded = chalk.cyan('#');
  _bar.symbols.notLoaded = chalk.red('-');
  _bar.width = 50;
  return _bar;
};

/**
 *
 * @param {object} server
 * @param {object} mcapJson
 * @returns {{progress: null, baseurl: string, username: string, password: string, rootPath: string, fields: {name:
 *   string, uuid: string}}}
 */
var setModelUpload = function (server, mcapJson) {
  var _bar = getProcessBar();
  modelUpload.progress = function (percent) {
    _bar.update(percent / 100);
    if ( percent >= 100 ) {
      printCat.info('\nCreate/Update application on ' + serverName);
    }
  };
  modelUpload.baseurl = server.baseurl;

  modelUpload.username = server.username;
  modelUpload.password = server.password;
  modelUpload.rootPath = path.normalize(getProjectDir());
  modelUpload.baseAlias = mcapJson.baseAlias;
  modelUpload.fields.name = mcapJson.name;
  modelUpload.fields.uuid = mcapJson.uuid;
  return modelUpload;
};
/**
 *
 * @returns {{name: string, value: string}[]}
 */
var getChoice = function () {
  var choices = [
    {
      name : 'Deploy Default',
      value: 'default'
    }
  ];
  var servers = mcaprc.list();
  _.each(servers.server, function (server, key) {
    if ( key !== servers.default_server ) {
      choices.push(
        {
          name : 'Deploy ' + key,
          value: key
        }
      )
    }
  });
  return choices;
};
/**
 * deploy application
 */
var deploy = function (args) {
  var mcapJson = getMcapJson();
  if ( !mcapJson ) {
    return notInProject();
  }

  if ( !validateProjectStructure() ) {
    return notValideProject();
  }

  var server = getDefaultServer(args);
  setModelUpload(server, mcapJson);

  var response = mctCore.deploy.deploy(modelUpload);
  console.log(response);
};

module.exports = function () {
  if ( this.args.length > 1 ) {
    deploy(this.args);
  } else {
    this.prompt(
      [
        {
          name   : 'deployServer',
          type   : 'list',
          message: 'Plz choose a Server where you want to deploy?',
          choices: getChoice()
        }
      ],
      function (answer) {
        if ( answer.deployServer !== 'default_server' ) {
          deploy([ 'deploy', answer.deployServer ]);
        } else {
          deploy([ 'deploy' ]);
        }
      }.bind(this));
  }

};
