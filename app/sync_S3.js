module.exports = () => {
  
  const getRemoteListS3 = require('./getRemoteList_S3')
  const RunQueue = require('run-queue')
  const bucket = 'akamai-netstorage-logs'
  const utils = require('./utils')
  const moment = require('moment')
  const fsp = require('promise-fs')

  const queue = new RunQueue({
    maxConcurrency: 1
  })

  let logData = {}, s3FilesList = [], currentMonth = moment().format('MM'), currentYear = moment().format('YYYY')

  getRemoteListS3(currentYear, currentMonth) /* (1) */
    .then(remoteFilesArr => {s3FilesList = remoteFilesArr})
    .then(() => {                   /* (2) */             /* (3) */                
      fsp.readdir('./ns_logs').then(files => files.filter(filename => (s3FilesList.indexOf(filename) === -1)))
        .then(localFilesToUpload => { /* (4) */
          logData.uploads = localFilesToUpload
          logData.sync_job = 's3'
          console.log('//*************** QUEUED FOR UPLOAD: ****************//')
          console.log(logData.uploads)
          // logData.uploads.forEach(file => { console.log(file) })
          console.log('//***************************************************//')
          logData.uploads.forEach((filename, index, array) => {
            let pathToFile = `./ns_logs/${filename}` /* fn utils.uploadFileToS3() splits file according to this format */
            queue.add(index, utils.uploadFileToS3, [pathToFile, bucket])
            // eslint-disable-next-line curly
            if (index === array.length-1) queue.add(array.length, utils.logger, [logData]) /* (5) */
          })
        }).then(() => {
          utils.processQueue(queue) /* (6) */
        })
    })
    .catch(errors => {
      console.log(errors)
    })
}

// ****************** SYNC S3 ****************** //
// ********************************************* //
// (*) SET CURRENT MONTH AND YEAR W/ MOMENT.JS (*)
// (1) READ CURRENT S3 FILE CONTENTS TO ARRAY/LIST
// (2) READ LOCAL FILE CONTENTS TO ARRAY/LIST
// (3) S3-LIST AS REFERENCE, FILTER LOCAL LIST 
// (4) SUBMIT REDUCED LOCAL LIST TO QUEUE
// (5) APPEND LOGGER TO END OF QUEUE
// (6) RUN QUEUE
// ********************************************* //
// ********************************************* //
