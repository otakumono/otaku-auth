var xport = require('node-xport')(module),
	mongoose = require('mongoose');

var User = mongoose.Schema({
	username: { type: String, required: true },
	hashword: { type: String, required: true },
	group: { type: Number, required: true },
	email: { type: String, required: true },
	registered: { type: Number, required: true },
	lastLogin: { type: Number, required: true },
	firstLogin: { type: Number, required: true },
	loginCount: { type: Number, required: true },
	firstIP: { type: String, required: true },
	lastIP: { type: String, required: true },
	ips: { type: [ String ], required: false }
});

xport(User);