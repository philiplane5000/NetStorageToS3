const sync_NS = require('./sync_NS')
const sync_S3 = require('./sync_S3')
const delLocalLogs = require('./delLocalLogs')
const CronJob = require('cron').CronJob
// https://crontab.guru/#45_*_*_*_*

/* “At minute 30 past hour 0, 8, and 16.” */
new CronJob('30 0,8,16 * * *', () => {
  sync_NS()
}, null, true, 'America/Los_Angeles')

/* “At minute 30 past hour 2, 6, 10, 14, 18, and 22.” */
new CronJob('30 2,6,10,14,18,22 * * *', () => {
  sync_S3()
}, null, true, 'America/Los_Angeles')

/* “At 00:00 on day-of-month 1.” */
new CronJob('0 0 1 * *', () => {
  delLocalLogs()
}, null, true, 'America/Los_Angeles')
