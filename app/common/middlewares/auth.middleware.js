'use strict';

const jwt      = require('jsonwebtoken');
const redis    = require('redis');
const client   = redis.createClient();
const Settings = require('../../../core/config/index.js');

function authMiddleware(req, res, next) {
  var token = req.headers['x-access-token'] || req.query.token || req.body.token;

  if (token) {

    client.get(token, function(err, reply) {

      if (reply === null) {
        return failedAuthToken(res);
      }

      jwt.verify(token, Settings.app.secret, function(err, decoded) {
        if (err) {
          return failedAuthToken(res);
        } else {
          req.user = decoded;
          next();
        }

      });

    });

  } else {
    return noTokenProvided(res);
  }

}

function failedAuthToken(res) {
  return res.json({
    success: false,
    message: 'Failed to authenticate token.'
  });
}

function noTokenProvided(res) {
  return res.status(403).send({
    success: false,
    message: 'No token provided.'
  });
}

module.exports = authMiddleware;
