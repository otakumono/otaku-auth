var xport = require('node-xport')
  , mongoose = require('mongoose')
  , autoinc = require('mongoose-auto-increment')
  ;

var Database = (function(config) {
    function Database() {}

    Database.config = config.get('database');
    Database.connection = null;
    Database.connectionString = null;

    Database.connectionString = function(host, port, name, user, pass) {
        if (!host) {
            return null;
        }

        if (arguments.length == 1) {
            pass = host.pass;
            user = host.user;
            name = host.name;
            port = host.port;
            host = host.host;
        }

        if (!host) {
            return null;
        }

        var partAuth = (user ? user + ':' + pass + '@' : '');
        var partPort = (port ? ':' + port : '');

        return 'mongodb://' + partAuth + host + partPort + '/' + name;
    };

    Database.connect = function(connectionString) {
        Database.connectionString = (connectionString || Database.connectionString(Database.config));
        
        mongoose.connect(Database.connectionString);
        Database.connection = mongoose.connection;

        autoinc.initialize(Database.connection);
        
        Database.connection.on('error', function(error) {
            console.log('Failed to connect to the database, exiting.');
            console.log('Error: ' + error);
            process.exit(1);
        });

        Database.connection.on('open', function() {
            console.log('Connection to the database established: \'%s\'.', Database.connectionString);
        });
    };

    Database.getUser = function(id, callback) {
        var User = require('../models/user');

        user.findOne({ 'id': id }, callback);
    };

    Database.findUser = function(name, callback) {
        var User = require('../models/user');
        console.log("teest");

        user.findOne({ 'login': name }, callback);
        console.log("post teest");
    };

    return Database;
});

xport(module, Database);