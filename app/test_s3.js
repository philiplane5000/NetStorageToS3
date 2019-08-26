const utils = require('./utils')

// utils.listBucketsS3('akamai-netstorage-logs')
utils.getFileNamesFromBucketS3('akamai-netstorage-logs').then(response => {
  console.log(response)
}).catch(err => {
  console.log(err)
})