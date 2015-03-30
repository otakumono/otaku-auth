var xport = require('node-xport')
  , nconf = require('nconf')
  , fs = require('fs')
  ;

var Config = (function(file, environment) {
    function Config() {}

    Config.provider = new nconf.Provider();
    Config.file = (file || 'config.json');
    Config.environment = (environment || (process.env.NODE_ENV || 'development'));
    Config.defaults = require('./config.default.json');

    Config.default = function(key, value) {
        Config.defaults[key] = value;
    };

    Config.save = function(callback) {
        callback = (callback || function(error) {
            if (error) {
                console.log('Failed to save configuration to \'' + Config.file + '\'');
                console.log('Error: ' + error);
                return;
            }

            console.log('Configuration saved in %s.', Config.file);
        });

        Config.provider.save(callback);
    };

    Config.parse = function() {
        if (!fs.existsSync(Config.file)) {
            console.log("Configuration file does not exist, attempting to write default values...");

            fs.writeFileSync(Config.file, JSON.stringify(Config.defaults, null, 2));
        }

        Config.provider.argv().env().defaults(Config.defaults).file({ 'file': Config.file });
    };

    Config.get = function(key, defaultValue) {
        var value = Config.provider.get(key);
        
        if (!value && defaultValue) {
            return defaultValue;
        }

        return value;
    };

    return Config;
});

xport(module, Config);