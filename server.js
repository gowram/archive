var throng = require('throng');
var WORKERS = process.env.WEB_CONCURRENCY || 1;
var express = require('express');
var app = express();
var path = require('path');

var force = require('./pg').force;
var setup = require('./pg').setup;
var pgp = require('./pg').pgp;

var PORT = process.env.PORT || 5000;

throng({
    workers: WORKERS,
    grace: 1000,
    lifetime: Infinity,
    start: startFunction
});

function startFunction() {

    app.use(express.static(path.join(__dirname, 'build')));

    app.set('port', PORT);

    app.get('/', (req, res) => res.render("build/index.html"));

    app.get('/init', (req, res) => setup.run(req, res));

    app.get('/mapping', (req, res) => force.get(req, res));

    app.get('/createtable', (req, res) => pgp.createTable(req, res));

    app.get('/reload', (req, res) => setup.reload(req, res));

    app.listen(app.get('port'), () => {
        console.log(`Heroku usage archive application running on port :${PORT}`)
    });

}