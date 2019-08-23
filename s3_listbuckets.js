const AWS = require('aws-sdk')
// Set the region 
AWS.config.update({region: 'us-east-1'})

let credentials = new AWS.SharedIniFileCredentials({profile: 'default'})
AWS.config.credentials = credentials

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'})

/* https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html */
/* OR CAN SAVE BELOW IN ~/.aws/credentials 
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
*/


s3.listBuckets(function(err, data) {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Success', data.Buckets)
  }
})

