var xport = require('node-xport')(module),
	Schemata = require('otaku-core').Database.Schemata;

Schemata.Auth = require('./auth');

/* Export the module */
xport(Schemata);