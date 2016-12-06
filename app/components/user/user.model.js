'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('ioke', 'root', 'local');
const User = require('../../common/schemes/users.js')(sequelize, Sequelize);

function UserModel() {
  let self = this;

  /// Public Methods
  ///////

  self.getAll     = getAll;
  self.getByID    = getByID;
  self.getByEmail = getByEmail;

  function getAll(callback) {
    let users = User.findAll();

    return new Promise(function(resolve, reject) {
      users.then(function(values) {
        let users = {
          'users': values
        };
        resolve(users);
      });
    });
  }

  function getByID(id) {
    let user = User.find({where: {id: id}, include: [Host]});

    return new Promise(function(resolve, reject) {
      user.then(function(value) {
        let user = {
          'user': value
        };

        resolve(user);
      });
    });
  }

  function getByEmail(email) {
    let user = User.findOne({
      attributes: ['id', 'firstName', 'name', 'email','password'],
      where: {
        email: email
      }
    });

    return new Promise(function(resolve, reject) {
      user.then(function(value) {
        resolve(value);
      });
    });
  }

  /// Private Methods
  ///////
}

module.exports = new UserModel;
