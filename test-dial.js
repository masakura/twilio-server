'use strict';

var fs = require('fs');
var TwilioServer = require('./index');
<<<<<<< HEAD
var config = JSON.stringify(fs.readFileSync('./config.json', 'utf-8'));
=======
var config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
>>>>>>> d4e4e21a9b4cd98e95c1760137846094b8bb6a13

var server = new TwilioServer(config.twilio);

server.start();

server.dial(config.twilio.to)
  .then(server.twiml(function() {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<Response>\n' +
      '  <Say>Hello</Say>\n' +
      '  <Gather finishOnKey="*">\n' +
      '    <Say>Press 1</Say>\n' +
      '  </Gather>\n' +
      '</Response>';
  }))
  .then(server.twiml(function(result) {
    var text = 'Press ' + result.Digits + ' key';
    console.log(text);

    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<Response>\n' +
      '  <Say>' + text + '</Say>\n' +
      '  <Hangup></Hangup>\n' +
      '</Response>';
  }))
  .catch(console.log);
