var xport = require('node-xport')(module),
    path = require('path'),
    restify = require('restify'),
    OtakuCore = require('otaku-core'),
    bcrypt = require('bcryptjs');

var HTTPError = OtakuCore.HTTPError;
var CommonDB = OtakuCore.Database.Common;

function OtakuAuth() {}

OtakuAuth.OtakuCore = OtakuCore;
OtakuAuth.Database = require('./database');

var server = null;
var database = null;
var browserify = require('browserify-cached');
var bundleCache = {};

function isBundleCached(module) {
  if (bundleCache[module]) {
    return true;
  }

  return false;
}

function cacheBundle(module, bundle) {
  bundle = (bundle || browserify(module));
  
  bundleCache[module] = bundle;
  
  return bundle;
}

function getBundle(module) {
  if (!isBundleCached(module)) {
    cacheBundle(module);
  }

  return bundleCache[module];
}

function preloadBundle(module) {
  cacheBundle(module)(true).pipe(process.stdout);
}

preloadBundle('bcryptjs');

OtakuAuth.prepare = function () {
  database = CommonDB.createInstance(OtakuAuth.Database.Auth, { name: 'otaku-auth' });
  database.connect();

  server = restify.createServer({
    name: 'OtakuAuth',
    version: '0.0.1'
  });

  server.use(restify.gzipResponse());

  server.get({ path: '/package/:package' }, function (request, response, next) {
    getBundle(request.params.package)(true).pipe(response);
    return next();
  });

  server.get({ path: '/count/:contentType' }, function (request, response, next) {
    database.countContent(request.params.contentType, function (error, result) {
          response.contentType = 'json';

          response.send(result);
    });

    return next();
  });

  server.get({ path: '/get/:contentType/:idName' }, function (request, response, next) {
    database.retrieveContent(request.params.contentType, request.params.idName, function (error, result) {
      response.contentType = 'json';

      //console.log(request.connection.remoteAddress);

      response.send(result);
    });

    return next();
  });

  server.get({ path: '/search/:contentType/:name' }, function (request, response, next) {
    database.searchContent(request.params.contentType, request.params.name, function (error, result) {
      response.contentType = 'json';

      console.log(result.result);
      //console.log(request.connection.remoteAddress);

      response.send(result);
    });

    return next();
  });

  server.get({ path: '/remove/:contentType/:id' }, function (request, response, next) {
    database.removeContent(request.params.contentType, request.params.id, function (error, result) {
      response.contentType = 'json';

      response.send(result);
    });

    return next();
  });

  server.get({ path: '/dbgchgpw/:username/:hashword/:token' }, function (request, response, next) {
    var username = decodeURIComponent(request.params.username);
    var hashword = decodeURIComponent(request.params.hashword);
    var token = decodeURIComponent(request.params.token);
    
    response.contentType = 'json';

    database.getSalt(request.params.username, function (error, result) {
      if (error) {
        return response.send(result);
      }
      
      var salt = result.result.salt;
      
      database.changePassword(username, bcrypt.hashSync(hashword, salt), bcrypt.hashSync(token, salt), function (error, result) {
        response.send(result);
      });
    });
  });

  server.get({ path: '/dbgsalt/:username' }, function (request, response, next) {
    database.getSalt(request.params.username, function (error, result) {
      response.contentType = 'json';

      response.send(result);
    });
  });

  server.get({ path: '/dbgcheckp/:username/:hashword' }, function (request, response, next) {
    var username = decodeURIComponent(request.params.username);
    var hashword = decodeURIComponent(request.params.hashword);
    
    response.contentType = 'json';

    database.getSalt(request.params.username, function (error, result) {
      if (error) {
        return response.send(result);
      }
      
      var salt = result.result.salt;
      var hashed = bcrypt.hashSync(hashword, salt);
      
      database.checkPassword(request.params.username, hashed, function (error, result) {
        response.send(result);
      });
    });
  });

  server.get({ path: '/dbgregi1/:username' }, function (request, response, next) {
    database.registerUser(request.params.username, 'test@test.com', function (error, result) {
      response.contentType = 'json';

      response.send(result);
    });
  });

  server.get({ path: '/dbgadd/:contentType' }, function (request, response, next) {
    var debugContent = {
      format: 0,
      genres: [1],
      title: [
        {
          languageCode: 'en_us',
          translations: ['Debug', 'Debug Anime']
        }
      ],
      dateCreated: 0,
      lastModified: 0,
      lastAccessed: 0,
      accessCount: 0
    };
    database.addContent(request.params.contentType, debugContent, function (error, result) {
      response.contentType = 'json';
      console.log("added: " + result);
      console.log("error: " + error);
      response.send(result);
    });

    return next();
  });

  server.get({ path: '/dbgupdate/:contentType/:id' }, function (request, response, next) {
    var debugContent = {
      format: 1,
      genres: [1, 3],
      title: [
        {
          languageCode: 'en_us',
          translations: ['Debug', 'Debug Anime']
        },
        {
          languageCode: 'jp_ja',
          translations: ['ディバッグアニメ']
        }
      ],
      dateCreated: 0,
      lastModified: 0,
      lastAccessed: 0,
      accessCount: 0
    };
    database.updateContent(request.params.contentType, request.params.id, debugContent, function (error, result) {
      response.contentType = 'json';
      console.log("update: " + result);
      console.log("error: " + error);
      response.send(result == null ? { thing: 'errorish' } : result);
    });

    return next();
  });

  server.post({ path: '/add' }, function (request, response, next) {
    return next();
  });

  server.post({ path: '/update' }, function (request, response, next) {
    return next();
  });
};

OtakuAuth.shutdown = function () {

};

OtakuAuth.run = function () {
  server.listen(9001, function () {
    console.log('Server "%s" listening on: "%s".', server.name, server.url);
  });
};

/* Export the module */
xport(OtakuAuth);