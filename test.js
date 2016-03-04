'use strict';

var fs = require('fs');
var twilio = require('twilio');
var TwilioServer = require('./index');
var config = JSON.stringify(fs.readFileSync('./config.json', 'utf-8'));


var server = new TwilioServer(config.twilio);
server.start();

server.receive(function(promise) {
  return promise
    .then(server.twiml(function () {
      var resp = new twilio.TwimlResponse();
      resp.say('Welcome!');
      resp.gather({
        finishOnKey: '*'
      }, function() {
        this.say('Press 1');
      });
      return resp.toString();
    }))
    .then(server.twiml(function (result) {
      var resp = new twilio.TwimlResponse();
      resp.say(result.Digits + ' Thanks!');
      resp.hangup();
      return resp.toString();
    }));
});
