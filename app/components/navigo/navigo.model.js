'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('navigo-api', 'root', 'root');
const Navigo = require('../../common/schemes/navigo.js')(sequelize, Sequelize);
const User = require('../../common/schemes/users.js')(sequelize, Sequelize);

Navigo.belongsTo(User, {foreignKey: 'userId'});

function NavigoModel() {
  let self = this;
  self.notFound = {error: true, message: 'Navigo not found'};
  self.byNumber = byNumber;
  /// Public Methods
  ///////

  function byNumber(number) {
    let query = {
      where: {
        number: number
      },
      include: [User]
    };
    return new Promise(function(resolve, reject) {
      Navigo.findOne(query)
        .then(function(navigo) {
          resolve(navigo);
        });
    });
  }

  /// Private Methods
  ///////
}

module.exports = new NavigoModel;
