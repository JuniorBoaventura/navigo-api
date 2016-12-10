'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('navigo-api', 'root', 'root');
const sha1      = require('sha1');
const jwt       = require('jsonwebtoken');
const User      = require('../../common/schemes/users.js')(sequelize, Sequelize);
const Navigo    = require('../navigo/navigo.model.js'); // Model
const Settings  = require('../../../core/config/index.js');

function UserModel() {
  let self     = this;

  /// Public Methods
  ///////

  self.getAll         = getAll;
  self.getByID        = getByID;
  self.getByEmail     = getByEmail;
  self.authentication = authentication;
  self.create         = create;

  function create(data, cardNumber = null) {
    data.password = sha1(data.password);
    let user = User.findOrCreate({where: {email: data.email}, attributes: ['firstname', 'lastname', 'email'], defaults: data});
    return new Promise(function(resolve, reject) {

      user.spread(function(user, created) {

        console.log(created);
        if (created == false) {
          reject({success: false, message: 'This user alreay exist'});
          return;
        }

        if (cardNumber == null) {
          delete user.dataValues.password;
          resolve(user);
          return;
        }

        // If the card number isn't null update userId in the navigo table
        Navigo.updateOwner(user.id, cardNumber)
          .then(function(navigo) {
            user.dataValues.navigo = {number: cardNumber};
            resolve(user);
          });

      });
    });
  }

  function authentication(email, password) {
    return new Promise(function(resolve, reject) {
      self.getByEmail(email)
        .then(function(user) {

          if (user.password != sha1(password)) {
            reject({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
            return;
          }

          let token = jwt.sign(JSON.stringify(user), Settings.app.secret);
          resolve({
            success: true,
            message: 'Authentication successfull',
            token: token
          });

        });
    });
  }

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
      attributes: ['id', 'firstName', 'lastname', 'email','password'],
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
