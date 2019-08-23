const AWS = require('aws-sdk')
// const fs = require('fs')
const fsp = require('promise-fs')
const utils = require('./utils')
const RunQueue = require('run-queue')

const queue = new RunQueue({
    maxConcurrency: 1
})

let pathToFile01 = './ns_logs/gia_m2m_584636.esw3c_S.201908221200-2400-0.gz'
let pathToFile02 = './ns_logs/gia_dsa_368164.esw3c_S.201908220000-1200-0.gz'
let bucket = 'ns-logs-bucket'
// utils.uploadFileToS3(pathToFile, bucket)

queue.add(0, utils.uploadFileToS3, [pathToFile01, bucket])
queue.add(1, utils.uploadFileToS3, [pathToFile02, bucket])

utils.processQueue(queue)

utils.listBucketsS3()
