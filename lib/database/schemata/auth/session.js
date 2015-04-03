var xport = require('node-xport')(module),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Session = mongoose.Schema({
	userId: { type: ObjectId, required: true },
	expiry: { type: Number, required: true },
	ip: { type: String, required: true },
	refreshable: { type: Boolean, required: false }
});

xport(Session);