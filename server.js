const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 1;
const express = require('./node_modules/react-scripts/node_modules/express');
const app = express();
const path = require('path');


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
        res.render("index.html");
    });

    app.listen(app.get('port'), function () {
        console.log(`Heroku usage archive application running on port :${PORT}`);
    });

}