var throng = require('throng');
var WORKERS = process.env.WEB_CONCURRENCY || 1;
var express = require('express');
var app = express();
var path = require('path');
var os = require('os');

var force = require('./force');
var setup = require('./setup');
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

    app.get('/mapping', (req, res) => force.get(req, res));

    app.get('/reload', (req, res) => setup.reload(req, res));

    app.get('/run', (req, res) => setup.run(req, res));

    app.listen(app.get('port'), () => {
        console.log(`Heroku usage archive application running on port :${PORT}`)
    });

}