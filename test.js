'use strict';

var fs = require('fs');
var TwilioServer = require('./index');
var config = JSON.stringify(fs.readFileSync('./config.json', 'utf-8'));

var server = new TwilioServer(config.twilio);
server.wait();
