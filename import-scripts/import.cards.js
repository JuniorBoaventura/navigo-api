const _         = require('lodash');
const fs        = require('fs');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('navigo-api', 'root', 'root', {
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
});

const Card = require('../app/common/schemes/cards.js')(sequelize, Sequelize);
const User = require('../app/common/schemes/users.js')(sequelize, Sequelize);

function getDataFile(name) {
  return fs.readFileSync(__dirname + '/specifications/data/' + name + '.lst', 'utf8');
}

let cards = getDataFile('cards').split('\n').slice(0, -1);
let cardsLength = cards.length;

console.time('Start execution');
createCard(0);

function createCard(cardId) {
  if (cardId <= cardsLength - 1) {
    let data = {
      number: cards[cardId],
      expiration: new Date('2017-12-05'),
      userId: cardId + 1
    };

    Card.create(data)
      .then(function(card) {
        console.log(cardId);
        createCard(cardId + 1);
      });
  } else {
    console.timeEnd('Start execution');
  }
}
