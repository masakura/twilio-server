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

  var defers = this.defers_;
  var options = this.options_;

  app.post(this.options_.path, (function(request, response) {
    console.log(request.body.From);
    var sid = request.body.CallSid;

    var defer = defers[sid];
    if (defer) {
      defer.resolve(request.body);

      setImmediate(function () {
        var make = defers[sid].makeTwiml;
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
    app.listen(options.port, function() {
      resolve(that);
    });
  })
};

TwilioServer.prototype.promise = function(sid, makeTwiml) {
  var defer = this.defers_[sid] = {};

  return new Promise(function(resolve, reject) {
    defer.resolve = resolve;
    defer.reject = reject;
    defer.makeTwiml = makeTwiml;
  });
};

TwilioServer.prototype.twiml = function(twiml) {
  var that = this;

  return function(result) {
    var sid = result.CallSid || result.sid;

    return that.promise(sid, function () { return twiml; });
  }
};

module.exports = TwilioServer;
