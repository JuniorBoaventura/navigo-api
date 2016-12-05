'use strict';

// This is an example of middleware with dependencies
function generateExampleMiddleware(dependency1, dependency2) {
  return function exampleMiddleware(req, res, next) {
    /*
      Do Something
    */

    next();
  };
}

module.exports = generateExampleMiddleware;
