var xport = require('node-xport')
  , Config = require('../lib/config')
  , Database = require('../lib/authorizer/database')
  ;

var config = Config('otaku.authorizer.json');
config.parse();

Database(config).connect();

var User = require('../lib/models/user');
User.create({
    login: 'test1',
    hashword: '$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK',
    timeCreated: 0,
    timeUpdated: 0,
    primaryEmail: 0,
    emails: [
        {
            address: 'em@i.l',
            visible: true
        }
    ],
    type: 'user',
    permissions: 1
}, function(error, document) {
    if (error) {
        console.log("Error occurred creating user.");
        console.log("Error: " + error);
        process.exit();
    }

    console.log("Created user successfully.");
    process.exit();
});