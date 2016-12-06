const _      = require('lodash');
const fs     = require('fs');
const bcrypt = require('bcrypt-nodejs');
const sha1   = require('sha1');
const Worker = require('webworker-threads').Worker;

const Sequelize = require('sequelize');
const sequelize = new Sequelize('navigo-api', 'root', 'root', {
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
});

const User = require('./app/common/schemes/users.js')(sequelize, Sequelize);
let users = getDataFile('users').split('\n').slice(0, -1);
let usersLength = users.length;

// Get file
function getDataFile(name) {
  return fs.readFileSync(__dirname + '/specifications/data/' + name + '.lst', 'utf8');
}

// Generate password
function makePwd(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

let emailProviders = [
  /* Default domains included */
  'aol.com', 'att.net', 'comcast.net', 'facebook.com', 'gmail.com', 'gmx.com', 'googlemail.com',
  'google.com', 'hotmail.com', 'hotmail.co.uk', 'mac.com', 'me.com', 'mail.com', 'msn.com',
  'live.com', 'sbcglobal.net', 'verizon.net', 'yahoo.com', 'yahoo.co.uk',

  /* Other global domains */
  'email.com', 'games.com' /* AOL */, 'gmx.net', 'hush.com', 'hushmail.com', 'icloud.com', 'inbox.com',
  'lavabit.com', 'love.com' /* AOL */, 'outlook.com', 'pobox.com', 'rocketmail.com' /* Yahoo */,
  'safe-mail.net', 'wow.com' /* AOL */, 'ygm.com' /* AOL */, 'ymail.com' /* Yahoo */, 'zoho.com', 'fastmail.fm',
  'yandex.com',

  /* French ISP domains */
  'hotmail.fr', 'live.fr', 'laposte.net', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 'gmx.fr', 'sfr.fr', 'neuf.fr', 'free.fr',
];

let providerLength = emailProviders.length - 1;

console.time('Start execution');

// let userList = _.chunk(users, 100000);
// for (var i = 0; i < userList.length; i++) {
//   console.log(i);
//   var worker = new Worker(function() {
//     generateUser(users);
//   });
// }

// generateUser(users);

function generateUser(list) {
  let userList = [];
  var i = 1;
  _.each(list, function(value) {
    console.log(i);
    let random = _.random(0, providerLength);
    let [lastname,firstname] = value.split(' ');
    let password = makePwd(15);
    let email = firstname + '.' + lastname + '@' + emailProviders[random];

    let data = {
        lastname: _.startCase(_.toLower(lastname)),
        firstname: _.startCase(_.toLower(firstname)),
        email: email.toLowerCase(),
        password: sha1(password)
      };
    console.log(data);

    if (userList.length == 10) {
      User.bulkCreate(userList, {individualHooks: true});
      userList = [];
    }

    userList.push(data);
    i++;
  });
  User.bulkCreate(data, {individualHooks: true});
}

createUser(0);

function createUser(userId) {
  if (userId <= usersLength - 1) {
    let user = users[userId];
    let random = _.random(0, providerLength);
    let [lastname,firstname] = user.split(' ');
    let password = makePwd(15);
    let email = firstname + '.' + lastname + '@' + emailProviders[random];

    let data = {
        lastname: _.startCase(_.toLower(lastname)),
        firstname: _.startCase(_.toLower(firstname)),
        email: email.toLowerCase(),
        password: sha1(password)
      };

    User.create(data)
      .then(function(user) {
        console.log(user);
        createUser(userId + 1);
      });
  } else {
    console.timeEnd('Start execution');
  }
}
