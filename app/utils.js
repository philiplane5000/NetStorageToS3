/* eslint-disable curly */
const ns = require('./netstorage.js')
const s3 = require('./s3')
const fs = require('fs')
const fsp = require('promise-fs')

module.exports = {

  fileExists: (pathToLocalFile) => {
    try {
      if (fs.existsSync(pathToLocalFile)) {
        return true
      } 
      return false
    } catch (err) {
      console.log(err)
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
    logData.processed_date = Date.now()
    let logPath = './log.txt'
    let writeToFile = ''
    if (typeof logData == 'string') {
      writeToFile += logData
    } else {
      writeToFile += JSON.stringify(logData)
    }
    writeToFile += ', '
    fs.appendFile(logPath, writeToFile, 'utf8', (err) => {
      if (err) console.log(err)
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
      return mtime
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

  uploadFileToS3: (pathToFile, bucketName) => {
    let fileName = pathToFile.split('/')[2] /* (!) ONLY WORKS IF LOGS ARE IN `./ns_logs/gia...` (!) */
    fsp.readFile(pathToFile).then(buffer => {
      let params = {Bucket: bucketName, Key: fileName, Body: buffer}
      s3.upload(params, function(err, data) {
        if (err) {
          console.log(`err: ${err}`)
        } else {
          console.log('//****** UPLOAD SUCCESFUL: ******//')
          console.log(`data: ${JSON.stringify(data)}`)
        }
      })
    }).catch(err => {
      console.log(err)
    })
  },

  listBucketsS3: () => {
    s3.listBuckets(function(err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        console.log('Success', data.Buckets)
      }
    })
  },

  getFileNamesFromBucketS3: (bucketName) => new Promise(function(resolve, reject) {
    let params = {
      Bucket: bucketName, 
      // MaxKeys: 2
    }
    s3.listObjects(params, function(err, data) {
      if (err) reject(err) // an error occurred
      else  resolve(data.Contents.map(object => object.Key)) /* resolve on file names */ 
    })
  }),

  processQueue: (queueObject) => {
    queueObject.run().then(res => {
      console.log(res)
    }).catch(errors => {
      console.log(errors)
    })
  },

}
