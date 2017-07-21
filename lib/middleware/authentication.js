"use strict";

//========================== Load Modules Start ===========================

//========================== Load external Module =========================

const _ = require('lodash');

//========================== Load internal Module =========================

const constants = require("../constants");
const jwtHandler = require("../jwtHandler");
const exceptions = require("../customExceptions");
const usrService = require('../services/userService');

//========================== Load Modules End =============================
/**
 * For authentication
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<T>|Promise}
 */
function autntctTkn(req, res, next) {
  const acsToken = req.get('Authorization');

  console.log(`acsToken ${acsToken}`);
  return jwtHandler.verifyUsrToken(acsToken)
    .then(function (tokenPayload) {
      req.user = tokenPayload;
      var query = "select * from users where id = $1";
      var param = [tokenPayload.id]
      return usrService.getUserByQuery(query , param);
    }).then(function (user) {
      if (!user ) {
        throw exceptions.unAuthenticatedAccess("User not valid.");
      }

      let isValidToken = false;
        if (user['accesstoken'] === acsToken) {
          isValidToken = true;

        }

      if (isValidToken) {
        next();
      } else {
        throw exceptions.unAuthenticatedAccess("User logged out already. Please login again.");
      }
    }).catch(function (err) {
      var error = {};
      error.errorCode = 1;
          error.msg = "Invalid Authorization"
      next(error);
    });
}

//========================== Export Module Start ===========================

module.exports = {
  autntctTkn ,

};

//========================== Export Module End ===========================
