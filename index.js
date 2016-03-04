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

  var that = this;
  var defers = this.defers_;
  var options = this.options_;

  app.post(this.options_.path, (function(request, response) {
    console.log(request.body.From);
    var sid = request.body.CallSid;

    var defer = defers[sid];

    if (!defer && that.receiveCallback_) {
      that.receiveCallback_(Promise.resolve(request.body));
      setImmediate(function () {
        defer = defers[sid];
      })
    }

    setImmediate(function () {
      if (defer) {
        defer.resolve(request.body);

          var make = defer.makeTwiml;
          if (make) {
            var body = make(request.body);
            if (body.then) {
              body = body.then(function (body) {
                response.send(body);
              })
            } else {
              response.send(body);
            }
          } else {
            response.end();
          }
      }
    });
  }));

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

    return that.promise(sid, twiml);
  }
};

TwilioServer.prototype.receive = function(callback) {
  this.receiveCallback_ = callback;
};

module.exports = TwilioServer;
