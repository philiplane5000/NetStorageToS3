const sync_NS = require('./app/sync_NS')
const sync_S3 = require('./app/sync_S3')
const CronJob = require('cron').CronJob
// https://crontab.guru/#15_*_*_*_*

new CronJob('45 * * * *', () => {
  sync_NS()
}, null, true, 'America/Los_Angeles')

new CronJob('15 * * * *', () => {
  sync_S3()
}, null, true, 'America/Los_Angeles')

