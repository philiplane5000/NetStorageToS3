
let netStorageSync = () => {
  
  const utils = require('./utils.js')
  const RunQueue = require('run-queue')
  const netstorage_root = '/408451/'
  const localLogFilePath = process.env.PATH_TO_LOCAL_LOG_FILE

  const queue = new RunQueue({
    maxConcurrency: 1
  })

  let fileExists = utils.fileExists(localLogFilePath) /* boolean */
  let remotelistJSON = utils.getCurrentNetStorageList(netstorage_root) /* used by both paths */
  let logData = {processed_date: Date.now()}

  if (fileExists) { /* PATH ONE (IDENTIFY AND DOWNLOAD RECENT LOGS) */
  // ************ //
    console.log('(1) READ PREVIOUSLY DOWNLOADED LIST                //')
    console.log('(2) SET MTIME FROM TOP (LAST ON RECORD)            //')
    console.log('(3) READ LATEST LOG FILE AND FILTER DOWN TO RECENT //')
    console.log('(4) SYNC FROM FILTERED LIST                        //')
    console.log('(5) DOWNLOAD + REWRITE `netstorage_list.txt`       //')
    console.log('(6) WRITE `logData`  TO `log.txt`                  //')
    // ************ //
    utils.readLocalNetStorageList(localLogFilePath) /* (1) */
      .then(data => data[0].mtime) 
      .then(mtime => { {logData.mtime = mtime} }) /* (2) */
      .then(() => {
        remotelistJSON.then(currentListJSON => { 
        // logData.processed_date = Date.now()
          logData.downloads = currentListJSON.filter(fileinfo => fileinfo.mtime > logData.mtime) /* (3) */
          console.log('*************** QUEUED FOR DOWNLOAD: **************//')
          console.log(logData.downloads) /* more like 'logsSoonToBeDownloaded' */
          console.log('***************************************************//')
          return logData
        }).then(({downloads}) => {
          downloads.forEach((logdetails, index, array) => {
            queue.add(index, utils.downloadLog, [logdetails.name]) /* (4) */
            if (index === array.length-1) { /* adds the listToFile and logger to end of queue => */
              queue.add(array.length, utils.listToFile, [netstorage_root, localLogFilePath]) /* (5) */ 
              queue.add(array.length+1, utils.logger, [logData]) /* (6) */
            }
          })
        }).then(() => {utils.processQueue(queue)})
          .catch(errors => {
            console.log(errors)
          })
      }).catch(errors => {
        console.log(errors)
      })
  } else { /* PATH TWO (DOWNLOAD ALL LOGS) */
  // ************ //
    console.log('(!) NO FILE TO REFERENCE (!)             //')
    console.log('(1) SYNC/DOWNLOAD ALL REMOTE LOGS        //')
    console.log('(2) DOWNLOAD LOGFILE FOR NEXT SYNC RUN   //')
    // ************ //
    logData.mtime = 0
    // logData.processed_date = Date.now()
    logData.downloads = []
    remotelistJSON.then(currentNetStorageList => {
    /* (!) UNCOMMENT BELOW LINE TO PROCESS ALL LOGS (!) */
    // let limit = currentNetStorageList.length 
      let limit = 5 /* TEMPORARY LIMIT TO PREVENT ALL LOGS FROM PROCESSING */
      for (let i = 0; i < limit; ++i) {
        logData.downloads.push(currentNetStorageList[i])
        queue.add(i, utils.downloadLog, [currentNetStorageList[i].name])
        if (i === limit-1) { /* adds fn's listToFile and logger to end of job queue => */
          queue.add(limit, utils.listToFile, [netstorage_root, localLogFilePath])
          queue.add(limit+1, utils.logger, [logData])
        }
      }
      console.log('*************** QUEUED FOR DOWNLOAD: **************//')
      console.log(logData.downloads)
      console.log('***************************************************//')
    }).then(()=> {utils.processQueue(queue)
    }).catch(errors => {console.log(errors)})
  }

}

module.exports = netStorageSync