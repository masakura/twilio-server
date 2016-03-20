# Twilio Simple Server
Simple HTTP Server for [Twilio](https://www.twilio.com/).

* To call phone
* Receive a phone call
* Write a response


## Usage
```
$ npm install --save-dev twilio-server
```

### Receive
```javascript
var TwilioServer = require('twilio-server');

var server = new TwilioServer({
  accountSid: '{Twilio Account Sid}',
  authToken: '{Twilo Auth Token}',
  from: '{Twilio Phone Number}',
  url: 'http://example.com:3001/',
  server: 'example.com',
  port: '3001',
  path: '/'
});

server.start();

server.receive(function(promise) {
  return promise
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
        '</Response>'

    }));
});
```
