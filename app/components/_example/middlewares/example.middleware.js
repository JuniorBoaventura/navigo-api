'use strict';

// This is an example of middleware without dependencies
function exampleMiddleware(req, res, next) {
  /*
    Do Something
  */

  next();
}

module.exports = exampleMiddleware;
