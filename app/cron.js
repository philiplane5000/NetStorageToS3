const netStorageSync = require('./sync')
const CronJob = require('cron').CronJob
// https://crontab.guru/#45_*_*_*_*

new CronJob('45 * * * *', () => {
  netStorageSync()
}, null, true, 'America/Los_Angeles')

