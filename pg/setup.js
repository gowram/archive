var axios = require('axios');
var loginSF = require('./force').loginSF;
var fetchObject = require('./force').fetchObject;

var connId;

var apikey = process.env.HEROKU_API_KEY;
var appName = process.env.HEROKU_APP_NAME;

axios.defaults.headers.common['Authorization'] = `Bearer ${apikey}`;

exports.run = function (req, res) {
    // Link Heroku Account with Heroku-Connect account
    axios.request({
        url: `https://connect-us.heroku.com/api/v3/users/me/apps/${appName}/auth`,
        method: 'POST'
    }).then(function (response) {
        //Get Connection Id, used for follow-up actions.
        return axios.request({
            url: `https://connect-us.heroku.com/api/v3/connections?app=${appName}`,
            method: 'GET'
        })
    })
        .then(function (response) {
            //validate if id available
            if (!response.data.count > 0) {
                throw new Error("Failed to fetch connection id")
            }
            else {
                connId = response.data.results[0].id
                // configure postgres schema 'salesforce' 
                return axios.request({
                    url: `https://connect-us.heroku.com/api/v3/connections/${connId}`,
                    method: 'PATCH', data: { "schema_name": "salesforce" }
                })
            }
        })
        .then(function (response) {
            console.log("ConnID: ", connId)
            //authroize heroku-connect to salesforce 
            return axios.request({
                url: `https://connect-us.heroku.com/api/v3/connections/${connId}/authorize_url`,
                method: 'POST', data: { "environment": "production", "redirect": "https://login.salesforce.com/services/oauth2/authorize?…" }
            })
        })
        .then(dt => {
            var url = dt.data.redirect
            res.redirect(url)
        })
        .catch(error => {
            res.json({
                success: false,
                error: error.message || error
            });
        });
}


exports.reload = function (req, res) {
    var mapData;

    loginSF()
        .then((con) => fetchObject(con))
        .then(response => {
            mapData = response
            return axios.request({
                url: `https://connect-us.heroku.com/api/v3/connections?app=${appName}`,
                method: 'GET'
            })
        })
        .then(function (response) {
            //validate if id available
            if (!response.data.count > 0) {
                throw new Error("Failed to fetch connection id")
            }
            else {
                connId = response.data.results[0].id
                console.log("connction: ", connId);
            }
            return axios.request({
                url: `https://connect-us.heroku.com/api/v3/connections/${connId}/actions/import`,
                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: mapData
            })
        })
        .then(() => {
            console.log("Imported")
            res.json({ success: true });
        })
        .catch(error => {
            res.json({
                success: false,
                error: error.message || error
            });
        });
}