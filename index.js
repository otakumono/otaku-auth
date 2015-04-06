var xport = require('node-xport')(module),
    OtakuAuth = require('./lib/'),
    OtakuCore = OtakuAuth.OtakuCore;

OtakuAuth.prepare();
OtakuAuth.run();

/* Export the module */
xport(OtakuAuth);