'use strict';

const Navigo = require('./navigo.model.js');

function NavigoController() {
  let self = this;

  const subscription = {
    Year:  'year',
    Month: 'month'
  };

  function init() {
    // You can remove it and init() if you don't need initialization function
  }

  init();

  /// Attributes
  ///////

  /// Public Methods
  ///////

  // navigo
  self.getNavigo           = getNavigo;
  self.postNavigo          = postNavigo;
  self.patchNavigo         = patchNavigo;

  function getNavigo(req, res) {

  }

  function postNavigo(req, res) {

  }

  function patchNavigo(req, res) {

  }

  // navigo/:navigoNumber
  self.getNavigoByNumber   = getNavigoByNumber;
  self.patchNavigoByNumber = patchNavigoByNumber;

  function getNavigoByNumber(req, res) {
    let navigoNumber = req.params.navigoNumber;
    Navigo.byNumber(navigoNumber)
      .then(function(navigo) {
        if (navigo != null) {
          return res.send(navigo);
        }
        return res.send(Navigo.notFound);
      });
  }

  function patchNavigoByNumber(req, res) {
    let navigoNumber = req.params.navigoNumber;

  }

  // navigo/:navigoNumber/validity
  self.getNavigoValidity = getNavigoValidity;

  function getNavigoValidity(req, res) {
    console.log('hello');
    let navigoNumber = req.params.navigoNumber;
    Navigo.validity(navigoNumber)
      .then(function(navigo) {
        res.send(navigo);
      }, function(error) {
        res.send(error);
      });
  }

  // navigo/:navigoNumber/renew
  self.postNavigoRenew = postNavigoRenew;

  function postNavigoRenew(req, res) {
    let navigoNumber = req.params.navigoNumber;
    let type = subscription.Month;
    let userId = 12; /* Must be changed by JWT */
    let stripeToken = req.body.stripeToken;

    Navigo.renew(navigoNumber, stripeToken, userId, type)
      .then(function(navigo) {
        res.send(navigo);
      }).catch(function(err) {
        res.send(err);
      });
  }

  /// Private Methods
  ///////

}

module.exports = NavigoController;
