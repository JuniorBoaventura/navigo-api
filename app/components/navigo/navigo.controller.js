'use strict';

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
  }

  function patchNavigoByNumber(req, res) {
    let navigoNumber = req.params.navigoNumber;

  }

  /// Private Methods
  ///////

}

module.exports = NavigoController;
