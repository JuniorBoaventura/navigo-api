'use strict';

// Stripe
const stripe = require('stripe')('sk_test_OGwQPF5EllevmGznSuDWvALy');

// Datetimejs
const dt = require('datetimejs');

// Lodash
const _         = require('lodash');
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
  self.byNumber = byNumber;
  self.validity = validity;
  self.renew    = renew;
  /// Public Methods
  ///////

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
        // let toto = today.diff(navigo.expiration);
        let daysLeft = daysUntil(today, navigo.expiration);
        let message  = daysLeft < 3 ? 'You card expire in ' + daysLeft + _(' day').pluralize(daysLeft) : 'You\'re are good to go 😊';
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
    /* type: Year(1) or 1 Month(2) */
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
        }

        let invoice = {
          amount: 1000,
          currency: 'eur',
          source: stripeToken,
          description: 'Navigo ' + quantity +  ' ' + _(type).pluralize(quantity) + ' membership'
        };

        var charge = stripe.charges.create(invoice, function(err, charge) {
          if (err && err.type === 'StripeCardError') {
            reject({sucess: false, message: 'The card has been declined'});
          }
        });

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
