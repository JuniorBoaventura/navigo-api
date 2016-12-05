'use strict';

function ExampleController() {
  let self = this;

  function init() {
    // You can remove it and init() if you don't need initialization function
  }

  init();

  /// Attributes
  ///////

  self.attribute1 = '';

  /// Public Methods
  ///////

  self.getExample   = getExample;
  self.postExample  = postExample;
  self.patchExample = patchExample;

  function getExample() {

  }

  function postExample() {

  }

  function patchExample() {

  }

  /// Private Methods
  ///////

  function privateMethodExample() {
    /*
      Do Something
    */
  }
}

module.exports = ExampleController;
