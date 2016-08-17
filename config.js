const config = {
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
        appName: process.env.HEROKU_APP_NAME,
        user: process.env.SALESFORCE_USER,
        pass: process.env.SALESFORCE_PASSWORD,
        token: process.env.SALESFORCE_TOKEN,
        namespace: process.env.SF_PKG_NAMESPACE || 'Invoice_it__',
        archiveObject: process.env.ARCHIVE_OBJECT || ['Usage_Charge__c'],
        archiveRule: process.env.ARCHIVE_RULE || "'status__c'='Completed'",
        cronTime: process.env.CRON_TIME || '0 0 * * * *'
    },
    meta: {
        env: process.env.NODE_ENV || 'development'
    }
}

if (process.env.NODE_ENV !== 'test') {
    config.database.pgUri = `${config.database.pgUri}?ssl=true`
}

module.exports = config
