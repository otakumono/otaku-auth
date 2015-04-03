var xport = require('node-xport')(module),
	mongoose = require('mongoose'),
	Validation = require('otaku-core').Validation,
	Datatype = require('otaku-core').Datatype,
	CommonDB = require('otaku-core').Database.Common,
	Schemata = require('./schemata'),
	bcrypt = require('bcryptjs'),
	ObjectId = mongoose.Schema.ObjectId;

var AuthDB = (function () {
	function AuthDB(options) {
		this.models = {};
		this.models['logs'] = null;
		this.models['user'] = null;
		this.models['group'] = null;
		this.models['permission'] = null;
		this.models['session'] = null;
	}

	AuthDB.prototype.connect = function () {
		CommonDB.connect(this);

		var db = this.connection;

		this.models['logs'] = db.model('modelLog', Schemata.Common.Log, 'logs');
		this.models['user'] = db.model('modelUser', Schemata.Auth.User, 'users');
		this.models['group'] = db.model('modelGroup', Schemata.Auth.Group, 'groups');
		this.models['permission'] = db.model('modelPermission', Schemata.Auth.Permission, 'permissions');
		this.models['session'] = db.model('modelSession', Schemata.Auth.Session, 'sessions');
	};

	AuthDB.prototype.disconnect = function (callback) {
		CommonDB.disconnect(this, callback);
	};

	AuthDB.prototype.registerUser = function (username, email, callback) {
		var hashword = bcrypt.genSaltSync(8);
		var salt = bcrypt.genSaltSync(10);

		var user = {
			'username': username,
			'salt': salt,
			'hashword': bcrypt.hashSync(hashword, salt),
			'email': email,
			'activationKey': bcrypt.genSaltSync(7) + bcrypt.genSaltSync(7),
			'group': null,
			'groups': [],
			'registered': 0,
			'lastLogin': 0,
			'firstLogin': 0,
			'loginCount': 0,
			'firstIP': '127.0.0.1',
			'lastIP': '127.0.0.1',
			'ips': []
		};

		return CommonDB.insert(this.models['user'], user, function (error, response) {
			if (error) {
				return callback(error, response);
			}

			response.result = { '_id': response.result._id, 'registrationToken': hashword, 'salt': salt };

			return callback(error, response);
		});
	};

	AuthDB.prototype.checkPassword = function (idUsername, hashword, callback) {
		var that = this;
		return this.getUser(idUsername, function (error, response) {
			if (error) {
				return callback(error, response);
			}

			var user = response.result;
			if (String(user.hashword).toLowerCase() === String(hashword).toLowerCase()) {
				return CommonDB.wrap(callback)(error, { _id: user._id, match: true });
			}

			return CommonDB.wrap(callback)(error, { match: false });
		});
	};

	AuthDB.prototype.regenSalt = function (idUsername, callback) {
		var hashword = bcrypt.genSaltSync(8);
		var salt = bcrypt.genSaltSync(10);

		var user = {
			'salt': salt,
			'hashword': bcrypt.hashSync(hashword, salt),
			'activationKey': bcrypt.genSaltSync(7) + bcrypt.genSaltSync(7)
		};

		return this.updateUser(idUsername, user, callback);
	};

	AuthDB.prototype.changePassword = function (idUsername, hashword, authorizationKey, callback) {
		var that = this;
		console.log(authorizationKey);
		return this.checkPassword(idUsername, authorizationKey, function (error, response) {
			if (error) {
				return callback(error, response);
			}
console.log(response);
			if (response.result.match) {
				return that.updateUser(response.result._id, { 'hashword': hashword }, callback);
			}

			return CommonDB.wrap(callback)('The username/password combination is invalid.', null);
		});
	};/*username: { type: String, required: true },
	hashword: { type: String, required: true },
	salt
	activationKey: { type: String, required: false },
	group: { type: Number, required: true },
	groups: [ { type: Number } ],
	email: { type: String, required: true },
	registered: { type: Number, required: true },
	lastLogin: { type: Number, required: true },
	firstLogin: { type: Number, required: true },
	loginCount: { type: Number, required: true },
	firstIP: { type: String, required: true },
	lastIP: { type: String, required: true },
	ips: { type: [ String ], required: false }*/

	AuthDB.prototype.deleteUser = function (idUsername, callback) {
		if (typeof idOrUsername === 'number') {

		} else {
			
		}
	};

	AuthDB.prototype.getUser = function (idUsername, callback) {
		if (Validation.isMongoId(idUsername)) {
			return CommonDB.findOne(this.models['user'], { '_id': idUsername }, callback);
		}

		return this.byUsername(idUsername, callback);
	};

	AuthDB.prototype.updateUser = function (idUsername, update, callback) {
		if (Validation.isMongoId(idUsername)) {
			return CommonDB.updateOne(this.models['user'], { '_id': idUsername }, update, callback);
		}

		var that = this;
		return this.searchUser(idUsername, function (error, response) {
			if (error) {
				return callback(error, response);
			}

			return that.updateUser(response.result._id, update, callback);
		});
	};

	AuthDB.prototype.searchUser = function (username, callback) {
		return this.byUsername(username, { '_id': 1 }, callback);
	};

	AuthDB.prototype.getSalt = function (idUsername, callback) {
		if (Validation.isMongoId(idUsername)) {
			return CommonDB.findOne(this.models['user'], { '_id': idUsername }, { 'salt': 1 }, callback);
		}

		return this.searchUser(idUsername, function (error, response) {
			if (error) {
				return callback(error, response);
			}

			return CommonDB.findOne(this.models['user'], response.result._id, { '_id': idUsername }, { 'salt': 1 }, callback);
		});
	};

	AuthDB.prototype.byUsername = function (username, selector, callback) {
		if (!username) {
			return CommonDB.wrap(callback)('Attempted to search for null or undefined username.', null);
		}

		username = String(username);

		return CommonDB.findOne(this.models['user'], { 'username': username }, selector, callback);
	};

	return AuthDB;
}());

xport(AuthDB);