'use strict';

const jwt    = require('jsonwebtoken');
const User   = require('../user/user.model.js');
const redis  = require('redis');
const client = redis.createClient();

function AuthenticationController() {
  let self = this;

  /// Public Methods
  ///////

  self.postAuthentication  = postAuthentication;

  function postAuthentication(req, res) {
    let email    = req.body.email;
    let password = req.body.password;

    User.getByEmail(email)
    .then(function(user) {

      if (user.password != password) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
        return;
      }

      let token = jwt.sign(JSON.stringify(user), 'tototot');

      client.set(token, 'session-ioke', redis.print);

      res.json({
        success: true,
        message: 'Authentication successfull',
        token: token
      });

    });
  }

}

module.exports = AuthenticationController;
