exports.method = () => {
  
  const utils = require('./utils.js')
  const RunQueue = require('run-queue')
  const netstorage_root = '/408451/'
  const localLogFilePath = process.env.PATH_TO_LOCAL_LOG_FILE

  const queue = new RunQueue({
    maxConcurrency: 1
  })

  // ******************************************** //
  // (1) READ PREVIOUSLY DOWNLOADED LIST                
  // (2) SET MTIME FROM TOP (LAST ON RECORD)            
  // (3) READ LATEST LOG FILE AND FILTER DOWN TO RECENT 
  // (4) SYNC FROM FILTERED LIST                        
  // (5) DOWNLOAD + REWRITE `/tmp/list.txt`      
  // (6) WRITE `logData`  TO `log.txt`                  
  // ********************************************* //

  let logData = {}
  
  if ( utils.fileExists(localLogFilePath) ) { 
    utils.readLocalNetStorageList(localLogFilePath) /* (1) */
      .then(data => data[0].mtime) 
      .then(mtime => { {logData.mtime = mtime} }) /* (2) */
      .then(() => {
        utils.getCurrentNetStorageList(netstorage_root).then(currentListJSON => { 
          logData.downloads = currentListJSON.filter(fileinfo => fileinfo.mtime > logData.mtime) /* (3) */
          logData.sync_job = 'netstorage'
          console.log('//*************** QUEUED FOR DOWNLOAD: **************//')
          console.log(logData.downloads)
          console.log('//***************************************************//')
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
      
  } else { 

    console.log('RUN CMD: `node getCurrentList.js` TO GENERATE LOCAL `app/tmp/list.txt` FOR FILE COMPARISON')
    
    //  BETTER TO USE RSYNC FOR LARGER TRANSFERS OF DATA ******** //
    /********************(DOWNLOAD ALL LOGS) **********************/
    /* (!) NO FILE TO REFERENCE (!)                               */
    /* (1) SYNC/DOWNLOAD ALL REMOTE LOGS                          */
    /* (2) DOWNLOAD LOGFILE FOR NEXT SYNC RUN                     */
    //*********************************************************** */
    // logData.mtime = 0
    // logData.downloads = []
    // remotelistJSON.then(currentNetStorageList => {
    //   for (let i = 0, limit = currentNetStorageList.length; i < limit; ++i) {
    //     logData.downloads.push(currentNetStorageList[i])
    //     queue.add(i, utils.downloadLog, [currentNetStorageList[i].name])
    //     if (i === limit-1) { /* adds fn's listToFile and logger to end of job queue => */
    //       queue.add(limit, utils.listToFile, [netstorage_root, localLogFilePath])
    //       queue.add(limit+1, utils.logger, [logData])
    //     }
    //   }
    //   console.log('*************** QUEUED FOR DOWNLOAD: **************//')
    //   console.log(logData.downloads)
    //   console.log('***************************************************//')
    // }).then(()=> {utils.processQueue(queue)
    // }).catch(errors => {console.log(errors)})
    
  }

}