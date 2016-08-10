const jsforce = require('jsforce');
const config = require('./config');
const conn = new jsforce.Connection();

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



exports.getMapping = new Promise(
  function (resolve, reject) {
    if (!(config.salesforce.user && config.salesforce.pass && config.salesforce.token)) {
      reject('Saleforce connection param missing...')
    } else {
      conn.login(config.salesforce.user, `${config.salesforce.pass}${config.salesforce.token}`, function (err, userInfo) {
        if (err) {           
          throw err;
        }
        
        mapConfig.connection.organization_id = userInfo.organizationId;
        conn.metadata.read('CustomObject', ['Usage_Staging__c'], function (err, meta) {
          if (err) { reject(err); }
          mapConfig.mappings[0].config = toObject(meta.fields);
          resolve(mapConfig);
        });
      });
    }
  });
