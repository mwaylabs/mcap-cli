var fs = require('fs');
var rc = require('rc');
var path = require('path');

var defaultConf = {
    default_server: "",
    server        : {}
};

/**
 * @const
 * @type {string}
 */
var DEFAULT = 'default_server';
var COMMAND_ADD = 'add';
var COMMAND_LIST = 'list';
var COMMAND_HELP = 'help';
var COMMAND_DEFAULT = 'default';
var COMMAND_REMOVE = 'remove';

var rcName = 'mcap';

/**
 * Select operation to given command
 * @param command the operation
 * @param attr the config attributes
 */
function parse(command, attr) {
    if ( command === COMMAND_ADD ) {
        add(attr);
    }
    else if ( command === COMMAND_LIST ) {

        return list(attr);
    }
    else if ( command === COMMAND_REMOVE ) {
        return remove(attr);
    }
    else if ( command === COMMAND_DEFAULT ) {
        return setDefault(attr[ 0 ]);
    }
    else {
        return list(attr);
    }
}

/**
 * Add a server to the list
 * @param attr ['name', 'baseurl', 'username', 'password']
 * @returns {*}
 */
function add(attr) {

    if ( !attr || !Array.isArray(attr) || !attr[ 0 ] ) {
        return get();
    }

    var newServer = {};
    newServer[ attr[ 0 ] ] = {
        "baseurl" : attr[ 1 ] || '',
        "username": attr[ 2 ] || '',
        "password": attr[ 3 ] || ''
    };

    var conf = rc(rcName, _deepCopy(defaultConf), { server: newServer });

    if ( !conf[ DEFAULT ] ) {
        conf[ DEFAULT ] = attr[ 0 ];
    }

    return _save(conf);
}

/**
 * Returns all settings
 * no param will return all configurations - if param exists then return the specific one - if none is found return
 * false
 * @param param
 * @returns {*}
 */
function get(param) {
    try {
        var config = rc(rcName, _deepCopy(defaultConf), []);
        if ( !param ) {
            // get the config
            return config;
        }
        else if(param === DEFAULT){
            var defaultServer = config[DEFAULT];
            return config['server'][defaultServer];
        }
        else if ( config['server'][ param ] ) {
            return config[ 'server' ][ param ];
        }
        return false;
    } catch ( e ) {
        console.error('Error on Get',chalk.red(e));
    }
}

/**
 * Print all settings
 * @returns {*}
 */
function list() {
    return get();
}

/**
 * Remove a configuration
 * @param attr
 * @returns {*}
 */
function remove(attr) {
    if ( !attr ) {
        return;
    }
    var rem = Array.isArray(attr) ? attr[ 0 ] : attr;
    // get the config
    var conf = get();
    // delete the given server
    delete conf[ 'server' ][ rem ];

    // [ 'default', 'config', '_' ]
    if ( Object.keys(conf).length <= 2 ) {
        // reset default if no server is present
        conf[ DEFAULT ] = defaultConf[ DEFAULT ];
    }
    return _save(conf);
}

/**
 * set the default alias
 * @param attr {string} the default value
 * @returns {*}
 */
function setDefault(attr) {
    if ( !attr || typeof attr !== 'string' ) {
        return;
    }
    // get the config
    var conf = get();
    if ( conf && conf[ 'server' ][ attr ] ) {
        conf[ DEFAULT ] = attr;
        _save(conf);
        return true;
    } else {
        return false;
    }
}

/**
 * Write a clean version of the config to the filesystem. The '.mcaprc' file must be present!
 * @param conf
 * @returns {*}
 * @private
 */
function _save(conf) {
    // get the path
    var _path = conf.config;

    // if no path is set the rc file doesn't exists
    if ( !_path ) {
        _path = path.normalize(getUserHome() + '/.' + rcName + 'rc');
    }

    // write a clean version of it
    fs.writeFileSync(_path, JSON.stringify(_clean(conf), null, 3));
    return conf;
}

/**
 * Return a copy of the config without rc attributes
 * @param conf
 * @returns {*}
 * @private
 */
function _clean(conf) {
    // deep copy
    var copy = _deepCopy(conf);
    // remove rc attributes
    delete copy._;
    delete copy.config;
    return copy;
}

/**
 * Copy the given object without functions!
 * @param conf
 * @returns {*}
 * @private
 */
function _deepCopy(conf) {
    return JSON.parse(JSON.stringify(conf));
}

/**
 * returns the home dir of the user
 * @returns {*}
 */
function getUserHome() {
    return process.env[ (process.platform == 'win32') ? 'USERPROFILE' : 'HOME' ];
}

module.exports.parse = parse;
module.exports.add = add;
module.exports.list = list;
module.exports.setDefault = setDefault;
module.exports.default_server = DEFAULT;
module.exports.remove = remove;
module.exports.get = get;
