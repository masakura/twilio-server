'use strict';

var fs = require('fs');
var twilio = require('twilio');
var TwilioServer = require('./index');
var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

var server = new TwilioServer(config.twilio);
server.start();

server.receive(function(promise) {
  return promise
    .then(server.twiml(function () {
      var resp = new twilio.TwimlResponse();
      resp.say('こんにちわ!', {language:'ja-JP'});
      resp.gather({
        finishOnKey: '*'
      }, function() {
        this.say('1 を押してください。', {language:'ja-JP'});
      });
      return resp.toString();
    }))
    .then(server.twiml(function (result) {
      var resp = new twilio.TwimlResponse();
      resp.say(result.Digits + ' ありがとう!', {language:'ja-JP'});
      resp.hangup();
      return resp.toString();
    }));
});
