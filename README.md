## NETSTORAGE TO S3

*A tool to automate the transfer Akamai NetStorage files or logs to S3.*

#### SETUP & CONFIG
* If directories `app/ns_logs` or `app/tmp` do not exist create them
* Set `cpCode` to correct value of applicable netstorage root folder in `app/netstorage.js`
* Save below values in `app/.env` <br />
* PATH_TO_LOCAL_LOG_FILE = absolute path

`app/.env` <br />
NS_HOSTNAME=<value_here>  <br />
NS_KEYNAME=<value_here>  <br />
NS_APIKEY=<value_here>  <br />
PATH_TO_LOCAL_LOG_FILE=<value_here>/NetStorageToS3/app/tmp/list.txt  <br />
AWS_ACCESS_KEY=<value_here>  <br />
AWS_SECRET_ACCESS_KEY=<value_here>  <br />

### RUNNING THE APP

#### STEP ONE
* `cd /app`
* `node getRemoteList_NS.js`

#### STEP TWO
* Adjust cron schedule in `app/app.js`
* `node app.js`

#### TOOLS USED
* [AWS-SDK-NodeSampleKit](https://github.com/aws-samples/aws-nodejs-sample)
* [Akamai-NetstorageKit-Node](https://github.com/akamai/NetStorageKit-Node)

#### IMPROVEMENTS
* https://stackoverflow.com/questions/26726862/how-to-determine-if-object-exists-aws-s3-node-js-sdk -- check if bucket exists vs. comparison with list


