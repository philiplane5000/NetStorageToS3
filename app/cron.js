const sync_NS = require('./sync_NS')
const sync_S3 = require('./sync_S3')
const CronJob = require('cron').CronJob
// https://crontab.guru/#30_*_*_*_*

new CronJob('30 * * * *', () => {
  sync_S3()
}, null, true, 'America/Los_Angeles')

