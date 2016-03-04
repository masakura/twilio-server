'use strict';

var fs = require('fs');
var twilio = require('twilio');
var TwilioServer = require('./index');
var config = JSON.stringify(fs.readFileSync('./config.json', 'utf-8'));

var twilioResponse = new twilio.TwimlResponse();
twilioResponse.say('Hello!');
console.log(twilioResponse.toString());

var server = new TwilioServer(config.twilio);
server.start()
  .then(server.twiml(twilioResponse.toSource()));
