const force = require('./force')
const logger = require('winston');
const axios = require('axios');
const openurl = require('openurl');

var connId;

const apikey = process.env.HEROKU_API_KEY || 'a3a3cea7-4a70-4457-b233-c3eada9eebb3';
const appName = process.env.HEROKU_APP_NAME || 'dev-archive';

axios.defaults.headers.common['Authorization'] = `Bearer ${apikey}`;

exports.run = function () {
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
                method: 'POST', data: { "environment": "production","redirect":"https://login.salesforce.com/services/oauth2/authorize?…"}
            })
        })
        .then(function (response) {           
            if(response.data && response.data.redirect){
                openurl.open(response.data.redirect)
            }            
            // restart heroku-connect connection.
            return axios.request({
                url: ` https://connect-us.heroku.com/api/v3/connections/${connId}/actions/restart`,
                method: 'POST'
            })
        })
        .then(function (response) {
            //fetch fields and indexes from salesforce as per heroku-connect mapping format.
            return force.getMapping
        })
        .then(function (response) {
            //import config.json to heroku-connect. 
            return axios.request({
                url: `https://connect-us.heroku.com/api/v3/connections/${connId}/actions/import`,
                method: 'POST', data: response
            })
        })
        .then(function (response) {
            return (response)
        })
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

this.run();