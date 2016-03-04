'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

function TwilioServer(optOptions) {
  this.options_ = _.extend({}, optOptions, {
    server: '',
    port: 3001,
    path: '/'
  });

  this.defers_ = [];
}

TwilioServer.prototype.start = function() {
  var app = express();
  app.use(bodyParser());

  var defers_ = this.defers_;
  var options = this.options_;

  app.post(this.options_.path, (function(request, response) {
    console.log(request.baseUrl);
    var sid = request.body.CallSid;

    var defer = this.defers_[sid];
    if (defer) {
      defer.resolve(request.body);

      setImmediate(function () {
        var make = defers_[sid].makeTwiml;
        if (make) {
          response.send(make(request.body));
        } else {
          response.end();
        }
      });
    }
  }));

  var that = this;
  return new Promise(function(resolve) {
    app.listen(options_.port, function() {
      resolve(that);
    });
  })
};

TwilioServer.prototype.receive = function() {
}
