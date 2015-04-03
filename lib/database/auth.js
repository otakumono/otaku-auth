var xport = require('node-xport')(module),
	mongoose = require('mongoose'),
	Datatype = require('otaku-core').Datatype,
	CommonDB = require('otaku-core').Database.CommonDB,
	CommonSchemata = CommonDB.CommonSchemata,
	AuthSchemata = require('./schemata/auth');

var AuthDB = (function () {
	function AuthDB(options) {
		this.models = {};
		this.models['logs'] = null;
		this.models['user'] = null;
		this.models['group'] = null;
	}

	AuthDB.prototype.connect = function () {
		CommonDB.connect(this);

		var db = this.connection;

		this.models['logs'] = db.model('modelLog', CommonSchemata.Log, 'logs');
		this.models['user'] = db.model('modelUser', AuthSchemata.User, 'users');
		this.models['group'] = db.model('modelGroup', AuthSchemata.Group, 'groups');
	};

	AuthDB.prototype.disconnect = function (callback) {
		CommonDB.disconnect(this, callback);
	};

	AuthDB.prototype.registerUser = function (username, hashword, email) {

	};

	AuthDB.prototype.deleteUser = function (idOrUsername) {
		if (typeof idOrUsername === 'number') {

		} else {
			
		}
	};

	AuthDB.prototype.getUser = function (idOrUsername) {
		if (typeof idOrUsername === 'number') {

		} else {

		}
	};

	return AuthDB;
}());

xport(AuthDB);