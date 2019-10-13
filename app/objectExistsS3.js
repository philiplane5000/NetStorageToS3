/* eslint-disable */
const utils = require('./utils')
const bucket = 'akamai-netstorage-logs'
const sampleLogData = [ 'gia_dsa_368164.esw3c_S.201910010000-1300-0.gz',
  'gia_dsa_368164.esw3c_S.201910011200-2400-0.gz',
  'gia_dsa_368164.esw3c_S.201910021200-2400-0.gz',
  'gia_dsa_368164.esw3c_S.201910031200-2500-0.gz',
  'gia_dsa_368164.esw3c_S.201910031200-2400-1.gz'] 

/* input for this async process = local `ns_logs` array */
const filterLocalToUploadList = async(logData, bucketName) => {
  let filesToUpload = []
  for (const file of logData) {
    const result = await utils.objectExistsPromiseS3(file, bucketName);
      if (result !== 'exists') {
        filesToUpload.push(file)
      }
    }
    return Promise.all(filesToUpload)
  }
/* resolves on filtered array of `filesToUpload` */

/* replace sampleLogData with current array-list of `ns_logs` */
filterLocalToUploadList(sampleLogData, bucket).then(upload => {
  console.log(upload)
}).catch(err => {
  console.log(err.message)
})

