'use strict';

const Settings = require('../../../core/config/index.js');

const stripe = require('stripe')(Settings.app.stripe);
const dt     = require('datetimejs');
const _      = require('lodash');
_.mixin(require('lodash-inflection'));

// Sequelize
const Sequelize = require('sequelize');
const sequelize = new Sequelize('navigo-api', 'root', 'root');
const Navigo    = require('../../common/schemes/navigo.js')(sequelize, Sequelize);
const User      = require('../../common/schemes/users.js')(sequelize, Sequelize);

Navigo.belongsTo(User, {foreignKey: 'userId'});

function NavigoModel() {
  let self      = this;
  const today   = new Date();
  self.notFound = {error: true, message: 'Navigo not found'};

  /// Public Methods
  ///////

  self.byNumber    = byNumber;
  self.validity    = validity;
  self.renew       = renew;
  self.updateOwner = updateOwner;

  function updateOwner(userId, number) {
    let query = {fields: ['userId'], where: {number: number}, returning: true, plain: true};
    return new Promise(function(resolve, reject) {
      Navigo.update({userId: userId}, query)
        .then(function(navigo) {
          resolve(navigo);
        });
    });
  }

  function byNumber(number) {
    let query = {
      where: {
        number: number
      },
      include: [User]
    };
    return findOne(query);
  }

  function validity(number) {

    let query = {
      where: {
        number: number,
        $and: {
          expiration: {$gte: today}
        },
      },
      include: [User]
    };

    return new Promise(function(resolve, reject) {
      findOne(query).then(function(navigo) {

        if (navigo == null) {
          reject({error: true, message: 'Card ' + number + ' is not valid'});
        }

        let daysLeft = daysUntil(today, navigo.expiration);
        let message  = daysLeft < 3 ? 'You card expire in ' + daysLeft + _(' day').pluralize(daysLeft) : 'Have a good day 😊';

        let response = {
          valid: true,
          expiration: navigo.expiration,
          daysLeft: daysLeft,
          message: message
        };
        resolve(response);
      });
    });

  }

  function renew(number, stripeToken, userId, type, quantity = 1) {
    // type: Year or 1 Month
    let query = {
      where: {
        number: number,
        $and: {
          userId: userId
        }
      }
    };
    return new Promise(function(resolve, reject) {
      findOne(query).then(function(navigo) {

        var expirationDate = navigo.expiration;
        let daysLeft       = daysUntil(today, expirationDate);

        if (daysLeft > 7) {
          reject({sucess: false, message: 'this card can\'t be renewed'});
          return;
        }

        let invoice = {
          amount: 1000,
          currency: 'eur',
          source: stripeToken,
          description: 'Navigo ' + quantity +  ' ' + _(type).pluralize(quantity) + ' membership'
        };

        var charge = stripe.charges.create(invoice, function(err, charge) {

          if (err) {
            reject({
              sucess: false,
              error: {
                type: err.type,
                message: err.message
              }
            });
            return;
          }

          var newExpiration = expirationDate;

          switch (type) {
            case 'year':
              newExpiration = dt.datetime.addYears(expirationDate, quantity);
            case 'month':
              newExpiration = dt.datetime.addMonths(expirationDate, quantity);
          }

          Navigo.update({expiration: newExpiration}, query)
            .then(function(navigo) {
              resolve({
                sucess: true,
                message: 'Card renewed for ' + quantity + ' ' + _(type).pluralize(quantity),
                navigo: {number: number, expiration: newExpiration}
              });
              return;
            });

        });

      }).catch(function(err) {
        console.log(err);
      });
    });
  }

  /// Private Methods
  ///////

  function findOne(query) {
    return new Promise(function(resolve, reject) {
      Navigo.findOne(query)
        .then(function(navigo) {
          resolve(navigo);
        });
    });
  }

  function daysUntil(from, to) {
    return Math.round((to - from) / (1000 * 60 * 60 * 24));
  }
}

module.exports = new NavigoModel;
