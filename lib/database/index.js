var xport = require('node-xport')(module),
	Database = require('otaku-core').Database;

Database.Auth = require('./auth');

/* Export the module */
xport(Database);