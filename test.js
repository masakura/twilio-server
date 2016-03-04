'use strict';

var fs = require('fs');
var twilio = require('twilio');
var TwilioServer = require('./index');
var config = JSON.stringify(fs.readFileSync('./config.json', 'utf-8'));

var twilioResponse = new twilio.TwimlResponse();
twilioResponse.say('本日はいい天気です');
console.log(twilioResponse.toString());

var server = new TwilioServer(config.twilio);
server.start();
