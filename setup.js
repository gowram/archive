var axios = require('axios');
var open = require('open');

var loginSF = require('./force').loginSF;
var fetchObject = require('./force').fetchObject;

var connId;

var apikey = process.env.HEROKU_API_KEY || 'a3a3cea7-4a70-4457-b233-c3eada9eebb3';
var appName = process.env.HEROKU_APP_NAME || 'test-dev-archive';

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
        //     //open(response.data.redirect)
        //     // restart heroku-connect connection.
        //     console.log("waiting 2 sec")
        //     setTimeout(function () {
        //         console.log("waiting over")
        //         return axios.request({
        //             url: ` https://connect-us.heroku.com/api/v3/connections/${connId}/actions/restart`,
        //             method: 'POST'
        //         })                
        //     }, 2000)

        // })
        // .then(function (response) {
        //     //fetch fields and indexes from salesforce as per heroku-connect mapping format.
        //     return loginSF()
        // })
        // .then((con) => fetchObject(con))
        // .then(function (response) {
        //     //import config.json to heroku-connect. 
        //     return axios.request({
        //         url: `https://connect-us.heroku.com/api/v3/connections/${connId}/actions/import`,
        //         method: 'POST', data: response
        //     })
        // })
        // .then(function (response) {
        //     res.json({ msg: response })
        //     return (response)
        // })
        .catch(function (error) {
            if (error.response) {
                //console.log(error.response.data.message);
                //console.log(error.response.status);
                //console.log(error.response.headers);
                return (error.response.data.message)
            } else {
                //console.log('Error', error.message);
                return (error.message)
            }
        });
}


exports.reload = function (req, res) {
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