const utils = require('./utils.js')
const netstorage_root = '/408451/'
const localLogFilePath = process.env.PATH_TO_LOCAL_LOG_FILE

utils.listToFilePromise(netstorage_root, localLogFilePath)
  .then(sorted => {
    console.log(`CURRENT LIST SAVED TO => ${localLogFilePath}`)
  }).catch(err => {
    console.log(err)
  })