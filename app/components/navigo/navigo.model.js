'use strict';

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
  let self = this;
  self.notFound = {error: true, message: 'Navigo not found'};
  self.byNumber = byNumber;
  self.validity = validity;
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
    let today = new Date();
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
        let daysLeft = daysBetweenDates(today, navigo.expiration);
        let message  = daysLeft < 3 ? 'You card expire in ' + daysLeft + _(' day').pluralize(daysLeft) : null;
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

  function daysBetweenDates(from, to) {
    return Math.round((to - from) / (1000 * 60 * 60 * 24));
  }
}

module.exports = new NavigoModel;
