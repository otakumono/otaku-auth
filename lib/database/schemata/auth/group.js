var xport = require('node-xport')(module),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId;

var Group = mongoose.Schema({
	name: { type: String, required: true },
	permission: { type: ObjectId, ref: 'Permission' },
	color: { type: Number, required: true }
});

xport(Group);