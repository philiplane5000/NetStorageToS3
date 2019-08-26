const AWS = require('aws-sdk')

AWS.config.update({region: 'us-west-2'})

const s3 = new AWS.S3({
  region: 'us-west-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

module.exports = s3
