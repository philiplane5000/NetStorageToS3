const utils = require('./utils.js');
const RunQueue = require('run-queue');
const netstorage_root = '/408451/';
// const netstorage_destination = '/408451';
const localLogFilePath = process.env.PATH_TO_LOCAL_LOG_FILE

const queue = new RunQueue({
    maxConcurrency: 1
})

const logQueue = new RunQueue({
    maxConcurrency: 1
})

let fileExists = utils.fileExists(localLogFilePath) /* boolean */
let remotelistJSON = utils.getRemoteDirListJSON(netstorage_root); /* used by both paths */
let logData = {}; /* stores previous mtime */

if (fileExists) {
    // ************ //
    console.log("(1) READ PREVIOUSLY DOWNLOADED LIST                //")
    console.log("(2) SET MTIME FROM TOP (LAST ON RECORD)            //")
    console.log("(3) READ LATEST LOG FILE AND FILTER DOWN TO RECENT //")
    console.log("(4) SYNC FROM FILTERED LIST                        //")
    console.log("(5) DOWNLOAD + REWRITE LIST.TXT                    //")
    console.log("(6) WRITE PROCESS INFO TO LOG.TXT                  //")
    // ************ //
    utils.readNetStorageLog(localLogFilePath) /* (1) */
    .then(data => data[0].mtime) 
    .then(mtime => { {logData.mtime = mtime;} }) /* (2) */
    .then(() => {
        remotelistJSON.then(currentListJSON => { 
            let logsToDownload = currentListJSON.filter(fileinfo => fileinfo.mtime > logData.mtime) /* (3) */
            console.log("************ QUEUED FOR DOWNLOAD: ************ ")
            console.log(logsToDownload)
            console.log("**********************************************")
            logData.runDate = Date.now();
            logData.downloads = logsToDownload;
            return logsToDownload
        }).then(logsToDownload => {
            logsToDownload.forEach((logdetails, index, array) => {
                queue.add(index, utils.downloadLog, [logdetails.name]) /* (4) */
                if(index == array.length-1) { /* adds the listToFile and logger to end of queue => */
                    queue.add(array.length, utils.listToFile, [netstorage_root, localLogFilePath]) /* (5) */ 
                    queue.add(array.length+1, utils.logger, [logData]) /* (6) */
                }
            })
            // logQueue.add(0, utils.logger, [logData])
        }).then(() => {
            queue.run().then(res => {
                console.log(res)
            }).catch(errors => {
                console.log(errors)
            }) 
        })
        .catch(errors => {
            console.log(errors)
        })
    }).catch(errors => {
        console.log(errors)
    })

} else {
    console.log("(!) NO FILE TO REFERENCE (!)             //")
    console.log("(1) SYNC/DOWNLOAD ALL REMOTE LOGS        //")
    console.log("(2) DOWNLOAD LOGFILE FOR NEXT SYNC RUN   //")
    utils.getRemoteDirListJSON(netstorage_root).then(nsDirListJSON => {
        nsDirListJSON.forEach((logdetails, index, array) => { /* (1) */
            queue.add(index, utils.downloadLog, [logdetails.name]) /* (4) */
            if(index == array.length-1) { /* adds the listToFile function to end of queue => (2) */
                queue.add(index+1, utils.listToFile, [netstorage_root, localLogFilePath])
            }
        })
    }).then(() => {
        queue.run().then(res => {
            console.log(res)
        }).catch(errors => {
            console.log(errors)
        })   
    })
    .catch(errors => {
        console.log(errors)
    })

}