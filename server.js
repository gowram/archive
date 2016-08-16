const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 1;
const express = require('express');
const app = express();
const path = require('path');

var force = require('./force');

console.log(process.env);

const PORT = process.env.PORT || 5000;

throng({
    workers: WORKERS,
    grace: 1000,
    lifetime: Infinity,
    start: startFunction
});

function startFunction() {

    app.use(express.static(path.join(__dirname, 'build')));
    app.set('port', PORT);

    app.get('/', function (req, res) {
        res.render("build/index.html");
    });

    app.get('/mapping', function (req, res) {
        force.getMapping
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
    });
    app.listen(app.get('port'), function () {
        console.log(`Heroku usage archive application running on port :${PORT}`);
    });

}