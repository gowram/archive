const config = {
    logger: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
    },
    database: {
        pgUri: process.env.DATABASE_URL || 'postgres://localhost:5432/salesforce'
    },
    server: {
        port: process.env.PORT || 5000
    },
    salesforce: {
        appName: process.env.APP_NAME = 'usageapp',
        user: process.env.SALESFORCE_USER || 'ramac@billing.lightning.com',
        pass: process.env.SALESFORCE_PASSWORD || 'Rama_2016',
        token: process.env.SALESFORCE_TOKEN || 'oLhTN81i2ehWJ3pO5J3fqwodN',
        namespace: process.env.SF_PKG_NAMESPACE || 'Invoice_it__',
        archiveObject: process.env.ARCHIVE_OBJECT || ['Usage_Charge__c'],
        archiveRule: process.env.ARCHIVE_RULE,
        cronTime: process.env.CRON_TIME
    },
    meta: {
        env: process.env.NODE_ENV || 'development'
    }
}

if (process.env.NODE_ENV !== 'test') {
    config.database.pgUri = `${config.database.pgUri}?ssl=true`
}

module.exports = config
