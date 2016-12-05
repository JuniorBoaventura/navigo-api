'use strict';

const colors    = require('colors');
const Kernel    = require('./core/kernel');
const options   = require('./core/config/options');
const appConfig = require('./core/config');

if (appConfig) {
  let config = options(appConfig);

  if (config) {
    new Kernel(config);
  } else {
    console.log('Error - Probably missing config file.'.red);
  }
} else {
  console.log('Error - Config files contains error(s).'.red);
}
