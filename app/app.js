const sync_NS = require('./sync_NS')
const sync_S3 = require('./sync_S3')
const CronJob = require('cron').CronJob
// https://crontab.guru/#45_*_*_*_*

new CronJob('15 * * * *', () => {
  sync_NS()
}, null, true, 'America/Los_Angeles')

new CronJob('45 * * * *', () => {
  sync_S3()
}, null, true, 'America/Los_Angeles')

