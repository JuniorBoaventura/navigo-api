'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('ioke', 'root', 'local');
const Navigo = require('../../common/schemes/navigo.js')(sequelize, Sequelize);

function NavigoModel() {
  let self = this;

  /// Public Methods
  ///////

  function findByNumber(number) {
    let qurey = {
      where: {
        number: number
      }
    };
    return new Promise(function(resolve, reject) {
      Navigo.findOne(query)
        .then(function(navigo) {

        });
    });
  }

  /// Private Methods
  ///////
}

module.exports = new NavigoModel;
