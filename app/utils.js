const ns = require('./netstorage.js')
const fs = require('fs')
/* https://www.npmjs.com/package/fs-extra /* <= consider using */

module.exports = {

  fileExists: (pathToLocalFile) => {
    try {
      if (fs.existsSync(pathToLocalFile)) {
        return true
      } 
      return false
    } catch (err) {
      // return false
    }
  },

  downloadLog: (nsSrc) => {
    ns.download(nsSrc, './ns_logs/', (error, response, body) => {
      if (error) { // errors other than http response codes
        console.log(`Got error: ${error.message}`)
        console.log(response.client) /* work on this for logging */
      }
      if (response.statusCode == 200) {
        console.log(body.message)
      } 
    }) 
  },

  list: (netstorage_path) => {
    ns.list(netstorage_path, (error, response, body) => {
      if (error) { // errors other than http response codes
        console.log(`Got error: ${error.message}`)
      }
      if (response.statusCode == 200) {
        console.log(JSON.stringify(body.list.file))
      } 
    })
  },

  listToFile: (netstorage_path, localPath) => {
    ns.list(netstorage_path, (error, response, body) => {
      if (error) { // errors other than http response codes
        console.log(`Got error: ${error.message}`)
      }
      if (response.statusCode == 200) {
        let filesArr = body.list.file
        let filesSorted = filesArr.sort((a,b) => {
          return b.mtime - a.mtime
        })
        fs.writeFile(localPath, JSON.stringify(filesSorted), (err) => {     
          if (err) {
            console.log(err)
          } else {
            console.log(`UPDATED => ${localPath}`)
          }
        })
      }
    })
  },

  listToFilePromise: (netstorage_path, fileDestination) => new Promise(function(resolve, reject) {
    ns.list(netstorage_path, (error, response, body) => {
      if (error) { // errors other than http response codes
        console.log(`Got error: ${error.message}`)
      }
      if (response.statusCode == 200) {
        let filesArr = body.list.file
        let filesSorted = filesArr.sort((a,b) => {
          return b.mtime - a.mtime
        })
        fs.writeFile(fileDestination, JSON.stringify(filesSorted), (err) => {     
          if (err) {
            reject(err)
          } else {
            resolve(filesSorted)
          }
        })
      }
    })
  }), 
    
  getCurrentNetStorageList: (netstorage_path) => new Promise(function(resolve, reject) {
    ns.list(netstorage_path, (error, response, body) => {
      if (error) {
        reject(error) /* prev: console.log(`Got error: ${error.message}`) */
      }
      if (response.statusCode == 200) {
        let filesListArr = body.list.file
        let filesListSorted = filesListArr.sort((a,b) => {
          return b.mtime - a.mtime
        })
        resolve(filesListSorted) /* sorted file list as JSON */
      }
    })
  }),

  logger: (logData) => {
    // let logContent = JSON.stringify(obj)
    let logPath = './log.txt'
    let writeToFile = ''
    if (typeof logData == 'string') {
      writeToFile += logData
    } else {
      writeToFile += JSON.stringify(logData)
    }
    writeToFile += ', '
    fs.appendFile(logPath, writeToFile, 'utf8', (err) => {
      if (err) { 
        throw err
      }
      console.log(`LogData appended to: ${logPath}`)
    })
  },

  getLastModified: (pathToFile) => { /* returns `mtime` of last run thru */
    let contentAsJSON, mtime
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      if (err) {
        console.log(err)
      }
      contentAsJSON = JSON.parse(data)
      mtime = contentAsJSON[0].mtime
      console.log(mtime) /* need to figure out how to return this */
    })
  },

  readLocalNetStorageList: (pathToFile) => new Promise(function(resolve, reject) {
    fs.readFile(pathToFile, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data)) /* resolves to JSON */
      }
    })
  }),

  processQueue: (queueObject) => {
    queueObject.run().then(res => {
      console.log(res)
    }).catch(errors => {
      console.log(errors)
    })
  }

}
