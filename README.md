## NETSTORAGE TO S3

Summary: A tool used to automate the transfer Akamai NetStorage files or logs to S3.

* Save below values in `app/.env` <br />
NS_HOSTNAME=<value_here>  <br />
NS_KEYNAME=<value_here>  <br />
NS_APIKEY=<value_here>  <br />
PATH_TO_LOCAL_LOG_FILE=<value_here>  <br />
AWS_ACCESS_KEY=<value_here>  <br />
AWS_SECRET_ACCESS_KEY=<value_here>  <br />

* Set `cpCode` to correct value of applicable netstorage root folder in `app/netstorage.js`

#### STEP ONE
* If directories `app/ns_logs` or `app/tmp` do not exist create them

#### STEP TWO
* `cd app`
* `node getCurrentList`

#### STEP THREE
* Adjust cron schedule in `app.js`
* `node app.js`
