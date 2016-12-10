'use strict';

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

    User.authentication(email, password)
      .then(function(auth) {
        client.set(auth.token, 'sess-navigo', redis.print);
        res.send(auth);
      }).catch(function(err) {
        res.send(err);
      });
  }

}

module.exports = AuthenticationController;
