var config = {
    logger: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
    },
    database: {
        pgUri: process.env.DATABASE_URL
    },
    server: {
        port: process.env.PORT || 5000
    },
    salesforce: {
        appName: process.env.HEROKU_APP_NAME || 'test-dev-archive',
        apiKey: process.env.HEROKU_API_KEY || 'a3a3cea7-4a70-4457-b233-c3eada9eebb3',
        user: process.env.SALESFORCE_USER || 'ramac@billing.lightning.com',
        pass: process.env.SALESFORCE_PASSWORD || 'Rama_2016',
        token: process.env.SALESFORCE_TOKEN || 'oLhTN81i2ehWJ3pO5J3fqwodN',
        namespace: process.env.SF_PKG_NAMESPACE || 'Invoice_it__',
        archiveObject: process.env.ARCHIVE_OBJECT || ['Usage_Staging__c'],
        archiveRule: process.env.ARCHIVE_RULE || "status__c='Completed'",
        cronTime: process.env.CRON_TIME || "*/30 * * * * *"
    },
    meta: {
        env: process.env.NODE_ENV || 'development'
    }
}

if (process.env.NODE_ENV !== 'test') {
    config.database.pgUri = `${config.database.pgUri}?ssl=true`
}

module.exports = config
