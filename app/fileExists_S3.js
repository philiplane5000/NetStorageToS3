const utils = require('./utils')
/* input filename to verify file upload in S3 */
let fileName = 'gia_dsa_368164.esw3c_S.201909010000-1200-0.gz'
let bucket = 'akamai-netstorage-logs'

utils.fileExistsS3(bucket, fileName).then(exists => console.log(exists))

