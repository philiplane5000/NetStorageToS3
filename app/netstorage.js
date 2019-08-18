const Netstorage = require('../lib/netstorage');
require('dotenv').config();

const config = {
  hostname: process.env.NS_HOSTNAME,
  keyName: process.env.NS_KEYNAME,
  key: process.env.NS_APIKEY,
  cpCode: 408451,
  ssl: false,
  // proxy: 'https://yourproxyurl.com:port' // Optional
}

module.exports = new Netstorage(config);