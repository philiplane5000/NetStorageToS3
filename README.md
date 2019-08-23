## NETSTORAGE TO S3

Summary: A tool used to automate the transfer Akamai NetStorage files or logs to S3.

* SAVE BELOW VALUES IN `app/.env`
-------------------------------------------//
NS_HOSTNAME=*****************************
NS_KEYNAME=******************************
NS_APIKEY=*******************************
PATH_TO_LOCAL_LOG_FILE=******************
AWS_ACCESS_KEY=**************************
AWS_SECRET_ACCESS_KEY=*******************
-------------------------------------------//

* SET `cpCode` TO CORRECT VALUE IN NETSTORAGE CONFIG FILE: `app/netstorage.js`

#### STEP ONE
* If directories `app/ns_logs` or `app/tmp` do not exist create them

#### STEP TWO
* `cd app`
* `node getCurrentList`

#### STEP THREE
* `cd app`
* Adjust cron schedule in `app.js`
* `node app.js`
