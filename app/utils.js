const ns = require('./netstorage.js');
const fs = require('fs');
/* https://www.npmjs.com/package/fs-extra /* <= consider using */

module.exports = {

    fileExists: (pathToLocalFile) => {
      try {
        if (fs.existsSync(pathToLocalFile)) {
          return true
        } 
        return false
      } catch(err) {
        // return false
      }
    },

    downloadLog: (nsSrc) => {
      ns.download(nsSrc, './sync', (error, response, body) => {
          if (error) { // errors other than http response codes
            console.log(`Got error: ${error.message}`)
            console.log(response.client) /* work on this for logging */
          }
          if (response.statusCode == 200) {
            console.log(body.message)
          } 
      }) 
    },

    downloadLogPromise: (nsSrc) => new Promise(function(resolve, reject) {
      ns.download(nsSrc, './', (error, response, body) => {
        if (error) {
          reject(err)
        } else if (response.statusCode == 200) {
          resolve(body)
        }
      })
    }),

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
          let filesArr = body.list.file;
          let filesSorted = filesArr.sort((a,b) => {
            return b.mtime - a.mtime
          })
          fs.writeFile(localPath, JSON.stringify(filesSorted), (err) => {     
            if(err) {
            console.log(err);
            } else {
              console.log("The file was saved!");
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
        let filesArr = body.list.file;
        let filesSorted = filesArr.sort((a,b) => {
          return b.mtime - a.mtime
        })
        fs.writeFile(fileDestination, JSON.stringify(filesSorted), (err) => {     
          if(err) {
            reject(err);
          } else {
            resolve(filesSorted);
          }
        })
      }
    })
    }), 
    
    getRemoteDirListJSON: (netstorage_path) => new Promise(function(resolve, reject) {
      ns.list(netstorage_path, (error, response, body) => {
        if (error) {
          reject(error) /* prev: console.log(`Got error: ${error.message}`) */
        }
        if (response.statusCode == 200) {
          let filesListArr = body.list.file;
          let filesListSorted = filesListArr.sort((a,b) => {
            return b.mtime - a.mtime
          })
          resolve(filesListSorted) /* sorted file list as JSON */
        }
      })
    }),

    writeJSONToLocalLogFile: (pathToLocalFile, filesListJSON) => {
      fs.writeFile(fileDestination, JSON.stringify(filesListJSON), (err) => {     
        if(err) {
        console.log(err);
        } else {
          console.log("The file was saved!");
        }
      })
    },

    writeJSONToLocalLogFilePromise: (pathToLocalFile, filesSorted) => new Promise(function(resolve, reject) {
      fs.writeFile(pathToLocalFile, JSON.stringify(filesSorted), (err) => {     
        if(err) {
          reject(err)
        } else {
          resolve("The file was saved!")
        }
      })
    }),

    logger: (logData) => {
      // let logContent = JSON.stringify(obj)
      let logPath = "./log.txt";
      let writeToFile = "";
      if (typeof logData == 'string') {
        writeToFile += logData
      } else {
        writeToFile += JSON.stringify(logData);
      }
      writeToFile += ", ";
      fs.appendFile(logPath, writeToFile, (err) => {
        if (err) throw err;
        console.log(`INFO LOGGED TO ${logPath}`)
      })
    },

    // listToFilePromise: (netstorage_path, fileDestination) => new Promise(function(resolve, reject) {
    //   ns.list(netstorage_path, (error, response, body) => {
    //     if (error) { // errors other than http response codes
    //       console.log(`Got error: ${error.message}`)
    //     }
    //     if (response.statusCode == 200) {
    //       let filesArr = body.list.file;
    //       let filesSorted = filesArr.sort((a,b) => {
    //         return b.mtime - a.mtime
    //       })
    //       fs.writeFile(fileDestination, JSON.stringify(filesSorted), (err) => {     
    //         if(err) {
    //           reject(err)
    //         // console.log(err);
    //         } else {
    //           resolve
    //           console.log("The file was saved!");
    //         }
    //       })
    //     }
    //   })
    // }),

    getLastModified: (pathToFile) => { /* returns `mtime` of last run thru */
      let contentAsJSON, mtime;
      fs.readFile(pathToFile, 'utf-8', (err, data) => {
          if (err) {
              console.log(err);
          }
          contentAsJSON = JSON.parse(data);
          mtime = contentAsJSON[0].mtime;
          console.log(mtime); /* need to figure out how to return this */
      });
    },

    readNetStorageLog: (pathToFile) => new Promise(function(resolve, reject) {
      fs.readFile(pathToFile, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data)) /* resolves to JSON */
        }
      })
    }),

  }