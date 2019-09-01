module.exports = () => {
  
  const getRemoteListNS = require('./getRemoteList_NS')
  const RunQueue = require('run-queue')
  const netstorage_root = '/408451/'
  const utils = require('./utils.js')
  const localList = process.env.PATH_TO_LOCAL_LOG_FILE

  const queue = new RunQueue({
    maxConcurrency: 1
  })

  let logData = {}
  
  if ( utils.fileExists(localList) ) { 
    
    utils.readLocalNetStorageList(localList) /* (1) */
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
              queue.add(array.length, utils.listToFile, [netstorage_root, localList]) /* (5) */ 
              queue.add(array.length+1, utils.logger, [logData]) /* (6) */
            }
          })
        }).then(() => {utils.processQueue(queue)})
          .catch(errors => { /* (?) neccessary catch block  (?) */
            console.log(errors)
          })
      }).catch(errors => {
        console.log(errors)
      })
      
  } else { 
    getRemoteListNS()
  }
  
}

// ************* SYNC NetStorage *************** //
// ********************************************* //
//  (1) READ & SORT PREVIOUSLY DOWNLOADED LIST                
//  (2) SET MTIME FROM TOP (LAST ON RECORD)            
//  (3) READ LATEST LOG FILE AND FILTER DOWN TO RECENT 
//  (4) SYNC FROM FILTERED LIST                        
//  (5) DOWNLOAD + REWRITE `/tmp/list.txt`      
//  (6) WRITE `logData`  TO `log.txt`                  
// ********************************************* //
// ********************************************* //