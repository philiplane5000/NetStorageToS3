/* getRemoteList_S3 => due to s3.listObjects limit of 1000 'MaxKeys' custom promise below resolves on current list of logs in S3 by currentYear & currentMonth */
module.exports = (yyyy, mm) => new Promise(function(resolve, reject) {

  const utils = require('./utils')
  const bucket = 'akamai-netstorage-logs'
  const servers = { m2m: ['584636'], dsa: ['368164', '379057', '368166']}
  const currentYear = yyyy
  const currentMonth = mm

  let remoteListS3 = []
  /* returns current list array for comparison with local files */
  utils.getFromBucketS3(bucket, 'm2m', servers.m2m[0], currentYear, currentMonth).then(res => {
    remoteListS3 = remoteListS3.concat(res)
    utils.getFromBucketS3(bucket, 'dsa', servers.dsa[0], currentYear, currentMonth).then(res => {
      remoteListS3 = remoteListS3.concat(res)
      utils.getFromBucketS3(bucket, 'dsa', servers.dsa[1], currentYear, currentMonth).then(res => {
        remoteListS3 = remoteListS3.concat(res)
        utils.getFromBucketS3(bucket, 'dsa', servers.dsa[2], currentYear, currentMonth).then(res => {
          resolve(remoteListS3.concat(res))
        })
      })
    })
  }).catch(err => { reject(err) })
        
})
        
// const servers = { m2m: ['584636'], dsa: ['368164', '379057', '368166']}
// const utils = require('./utils')
/* GET ALL M2M LOGS ON SERVER '584636' FROM 2019 */
// utils.getFromBucketS3('akamai-netstorage-logs', 'm2m', servers.m2m[0], '2018', '01').then(response => {
//   console.log(response.length)
// }).catch(err => {
//   console.log(err)
// })
// 465

/* GET ALL DSA LOGS ON SERVER '368164' FROM 2019 */
// utils.getFromBucketS3('akamai-netstorage-logs', 'dsa', servers.dsa[0], '2018', '02').then(response => {
//   console.log(response)
// }).catch(err => {
//   console.log(err)
// })
// 480


/* GET ALL DSA LOGS ON SERVER '379057' FROM 2019 */
// utils.getFromBucketS3('akamai-netstorage-logs', 'dsa', servers.dsa[1], '2018').then(response => {
//   console.log(response.length)
// }).catch(err => {
//   console.log(err)
// })
// 332

/* GET ALL DSA LOGS ON SERVER '368166' FROM 2019 */
// utils.getFromBucketS3('akamai-netstorage-logs', 'dsa', servers.dsa[2], '2018').then(response => {
//   console.log(response.length)
// }).catch(err => {
//   console.log(err)
// })
// 332
