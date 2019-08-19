const netStorageSync = require('./sync')
const CronJob = require('cron').CronJob
// https://crontab.guru/#30_*_*_*_*

new CronJob('30 * * * *', () => {
  netStorageSync()
}, null, true, 'America/Los_Angeles')

