const cron = require('node-cron');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
//serverURL =  `${process.env.DATABASE_URL}?ssl=true`
var pgURL = 'postgres://kyvzmrufcnkyks:HbK89KK9XA2bJlTlHi5MPt9NIE@ec2-54-83-27-147.compute-1.amazonaws.com:5432/d6i4hivdddi779?ssl=true';
var db = pgp(pgURL)
const schema = 'salesforce'
const unit = process.env.CRON_TIME || "*/15 * * * * *"
var qryVal = process.env.ARCHIVE_RULE || "status__c='Completed' limit 2";

exports.createTable = function (req, res) {

    db.none(`CREATE TABLE IF NOT EXISTS ${schema}.usagearchive(id VARCHAR(18),data JSONB); CREATE INDEX IF NOT EXISTS idx_usagearchive ON ${schema}.usagearchive USING gin(data)`)
        .then(() => { res.json({ success: true }) })
        .catch(error => {
            res.json({
                success: false,
                error: error.message || error
            });
        });

}

function insertVal(rows, t) {
    var queries = [];
    rows.forEach(function (row) {
        queries.push(t.none(`INSERT INTO ${schema}.usagearchive (id, data) VALUES($1,$2)`, [row.sfid, row]))
        queries.push(t.none(`DELETE FROM ${schema}.usage_staging__c WHERE sfid=$1`, row.sfid))
    })
    return t.batch(queries);
}


cron.schedule(unit, function (err) {

    db.tx(t => {
        return t.any(`SELECT * FROM ${schema}.usage_staging__c WHERE ${qryVal}`)
            .then(data => {
                return insertVal(data, t)
            });
    })
        .then(data => {
            var count = parseInt(data.length)
            console.log("postgres success", count / 2, "rows affected.");
            // success
        })
        .catch(error => {
            // error
            console.log("ERROR:", error);
        });

    console.log('\n cron task started at -', new Date());
}, true);

