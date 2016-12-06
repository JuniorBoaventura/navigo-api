'use strict';

const Navigo = require('./navigo.model.js');

function NavigoController() {
  let self = this;

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

  // navigo/validity
  self.postNavigoValidity = postNavigoValidity;

  function postNavigoValidity(req, res) {
    let navigoNumber = req.params.navigoNumber;
    Navigo.validity(navigoNumber)
      .then(function(navigo) {
        res.send(navigo);
      }, function(error) {
        res.send(error);
      });
  }

  /// Private Methods
  ///////

}

module.exports = NavigoController;
