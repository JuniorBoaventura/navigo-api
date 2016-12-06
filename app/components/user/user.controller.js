'use strict';

const User = require('./user.model.js');

function UserController() {
  let self = this;

  // /user
  self.getUser   = getUser;
  self.postUser  = postUser;
  self.patchUser = patchUser;

  // /user/:userId
  self.getUserByID    = getUserByID;
  self.postUserByID   = postUserByID;
  self.patchUserByID  = patchUserByID;
  self.deleteUserByID = deleteUserByID;

  function getUser(req, res) {
    User.getAll()
      .then(function(values) {
        res.send(values);
      });
  }

  function postUser(req, res) {
    res.send('postUser');
  }

  function patchUser(req, res) {
    res.send('patchUser');
  }

  function getUserByID(req, res) {
    let userID = req.params.userID;

    User.getByID(userID)
      .then(function(value) {
        res.send(value);
      });
  }

  function patchUserByID(req, res) {
    res.send('patchUserByID');
  }

  function postUserByID(req, res) {
    res.send('postUserByID');
  }

  function deleteUserByID(req, res) {
    res.send('deleteUserByID');
  }
}

module.exports = UserController;
