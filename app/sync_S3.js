const utils = require('./utils')
const RunQueue = require('run-queue')

const queue = new RunQueue({
    maxConcurrency: 1
})

/* PSUEDO CODE FOR STEPS */
/*
(1) READ LOCAL FILE CONTENTS TO LIST
(2) READ S3 FILE CONTENTS TO LIST
(3) REDUCE LOCAL LIST IN COMPARISON TO REMOTE LIST
(4) SUBMIT REDUCED LOCAL LIST TO QUEUE
(5) RUN QUEUE
*/

let pathToFile01 = './ns_logs/gia_m2m_584636.esw3c_S.201908221200-2400-0.gz'
let pathToFile02 = './ns_logs/gia_dsa_368164.esw3c_S.201908220000-1200-0.gz'
let bucket = 'ns-logs-bucket'

queue.add(0, utils.uploadFileToS3, [pathToFile01, bucket])
queue.add(1, utils.uploadFileToS3, [pathToFile02, bucket])

utils.processQueue(queue)
