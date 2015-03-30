var xport = require('node-xport')
  , mongoose = require('mongoose')
  , autoinc = require('mongoose-auto-increment')
  ;

var SchemaEmail = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    visible: {
        type: Boolean,
        default: false
    }
});

var SchemaProfile = mongoose.Schema({
    bio: {
        type: String,
        default: null
    },
    websites: {
        type: [String],
        default: null
    },
    twitter: {
        type: String,
        default: null
    },
    github: {
        type: String,
        default: null
    },
    myanimelist: {
        type: String,
        default: null
    },
    crunchyroll: {
        type: String,
        default: null
    }
});

var SchemaUser = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    hashword: {
        type: String,
        required: true
    },
    timeCreated: {
        type: Number,
        required: true
    },
    timeUpdated: {
        type: Number,
        required: true
    },
    primaryEmail: {
        type: Number,
        required: true
    },
    emails: {
        type: [SchemaEmail],
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    permissions: {
        type: Number,
        default: 0
    },
    profile: {
        type: {
            bio: {
                type: String,
                default: null
            },
            websites: {
                type: [String],
                default: null
            },
            twitter: {
                type: String,
                default: null
            },
            github: {
                type: String,
                default: null
            },
            myanimelist: {
                type: String,
                default: null
            },
            crunchyroll: {
                type: String,
                default: null
            }
        },
        default: null
    },
    followers: {
        type: Number,
        default: -1
    },
    following: {
        type: Number,
        default: -1
    }
});

SchemaUser.plugin(autoinc.plugin, { model: 'ModelUser', field: 'id', startAt: 0, incrementBy: 1 })

xport(module, mongoose.model('ModelUser', SchemaUser, 'users'));