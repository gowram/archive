var jsforce = require('jsforce');
var config = require('./config');

var mapConfig = {
  version: 1,
  connection: {
    app_name: config.salesforce.appName,
    exported_at: new Date().toISOString(),
    organization_id: ''
  },
  mappings: [
    {
      object_name: config.salesforce.archiveObject[0],
      config: {}
    }
  ]
}

function toObject(arr) {
  var rv = {
    access: "read_write",
    sf_max_daily_api_calls: 30000,
    sf_polling_seconds: 120,
    sf_notify_enabled: true,
    'fields': {
      "Id": {},
      "CreatedDate": {},
      "Name": {},
      "IsDeleted": {},
      "SystemModstamp": {}
    },
    'indexes': {
      "Id": { "unique": true },
      "CreatedDate": { "unique": false },
      "Name": { "unique": false },
      "SystemModstamp": { "unique": false }
    }
  };
  for (var i = 0; i < arr.length; ++i) {
    var formula = arr[i].formula;
    if (formula == undefined) {
      var name = arr[i].fullName;
      rv['fields'][name] = {}
      rv['indexes'][name] = { 'unique': false }
    }
  }
  return rv;
}

function isEmptyObject(obj) {
  return JSON.stringify(obj) === '{}';
}


var loginSF = function () {

  return new Promise(function (resolve, reject) {
    if (!(config.salesforce.appName && config.salesforce.user && config.salesforce.pass && config.salesforce.token)) {
      reject('Saleforce login params or app name missing')
    } else {
      var connection = new jsforce.Connection()
      connection.login(config.salesforce.user, `${config.salesforce.pass}${config.salesforce.token}`)
        .then((userInfo) => {
          mapConfig.connection.organization_id = userInfo.organizationId
          console.log('salesforce#login: success')
          resolve(connection)

        })
        .catch((err) => {
          reject(err)
        })
    }
  })

}



var fetchObject = function (con) {
  return new Promise(function (resolve, reject) {
    con.metadata.read('CustomObject', config.salesforce.archiveObject)
      .then((result) => {
        if (!isEmptyObject(result)) {
          mapConfig.mappings[0].config = toObject(result.fields)
          console.log(mapConfig)
          resolve(mapConfig)
        } else {
          reject('Saleforce object name invalid, cannot be archived.')
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}



exports.loginSF = loginSF
exports.fetchObject = fetchObject

exports.get = function (req, res) {
  loginSF()
    .then((con) => fetchObject(con))
    .then(data => {
      res.json({
        success: true,
        data
      });
    })
    .catch(error => {
      res.json({
        success: false,
        error: error.message || error
      });
    });
}