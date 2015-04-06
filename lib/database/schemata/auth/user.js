var xport = require('node-xport')(module),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId;

var User = mongoose.Schema({
    username: { type: String, required: true },
    salt: { type: String, required: true },
    hashword: { type: String, required: true },
    activationkey: { type: String, required: false },
    group: { type: ObjectId, required: false },
    groups: [ { type: ObjectId } ],
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