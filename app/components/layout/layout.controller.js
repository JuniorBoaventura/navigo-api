'use strict';

function HomeController() {
  let self = this;

  /// Public Methods
  ///////

  self.getHome = getHome;

  function getHome(req, res) {
    res.send('Hello from Hybrid.js');
  }
}

module.exports = HomeController;
