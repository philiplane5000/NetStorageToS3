const getListS3 = require('./getRemoteList_S3.js')
const moment = require('moment')

let currentYear = moment().format('YYYY')
let currentMonth = moment().format('MM')

getListS3(currentYear, currentMonth).then(res => console.log(res))
