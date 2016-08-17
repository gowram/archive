const jsforce = require('jsforce');
const config = require('./config');
const logger = require('winston');

var mapConfig = {
  version: 1,
  connection: {
    app_name: config.salesforce.appName,
    exported_at: new Date().toISOString(),
    organization_id: ""
  },
  mappings: [
    {
      object_name: config.salesforce.archiveObject,
      config: {
        access: "read_write",
        sf_max_daily_api_calls: 30000,
        sf_polling_seconds: 120,
        sf_notify_enabled: true,
        indexes: {},
        fields: {}
      }
    }
  ]
}

function toObject(arr) {
  var rv = {
    'fields': {},
    'indexes': {}
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


exports.getMapping = new Promise(function (resolve, reject) {

  login = function () {
    if (!this.loggedIn) {
      if (!(config.salesforce.appName && config.salesforce.user && config.salesforce.pass && config.salesforce.token)) {
        this.loggedIn = Promise.reject('Saleforce login params or app name missing')
      } else {
        this.connection = new jsforce.Connection()
        this.loggedIn = this.connection.login(config.salesforce.user, `${config.salesforce.pass}${config.salesforce.token}`)
      }
      this.loggedIn
        .then((userInfo) => {
          mapConfig.connection.organization_id = userInfo.organizationId
          logger.info('salesforce#login: success')
        })
        .catch((err) => {
          reject(err)
        })
    }
    return this.loggedIn
  }


  getMeta = function (con) {
    con.metadata.read('CustomObject', config.salesforce.archiveObject)
      .then((result) => {        
        if (!isEmptyObject(result)) {
          mapConfig.mappings[0].config = toObject(result.fields)
          resolve(mapConfig)
        } else {
          reject('Saleforce object name invalid, cannot be archived.')          
        }
      })
  }

  return login()
    .then(() => {
      return getMeta(this.connection)      
    })
    .catch((err) => {
      reject(err)
    })

});

