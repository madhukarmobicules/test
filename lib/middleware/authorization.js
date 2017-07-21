/**
 * Created by madhukar on 15/6/17.
 */
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

function isAdmin(req, res, next) {
    const acsToken = req.get('Authorization');

    console.log(`acsToken ${acsToken}`);
    return jwtHandler.verifyUsrToken(acsToken)
        .then(function (tokenPayload) {
            req.user = tokenPayload;
            var role = tokenPayload.role
            if (role = constants.ROLES.ADMIN) {
                next();
            } else {
                throw exceptions.unAuthenticatedAccess("User Is not Admin.");
            }
        }).catch(function (err) {
            var error = {};
            error.errorCode = 1;
            error.msg = "Invalid Authorization"
            next(error);
        });
}


function isSuperAdmin(req, res, next) {
    const acsToken = req.get('Authorization');

    console.log(`acsToken ${acsToken}`);
    return jwtHandler.verifyUsrToken(acsToken)
        .then(function (tokenPayload) {
            req.user = tokenPayload;
            var role = tokenPayload.role
            if (role == constants.ROLES.SUPERADMIN) {
                next();
            } else {
                throw exceptions.unAuthenticatedAccess("User Is not super admin.");
            }
        }).catch(function (err) {
            var error = {};
            error.errorCode = 1;
            error.msg = "Not Authorized."
            next(error);
        });
}



function isClient(req, res, next) {
    const acsToken = req.get('Authorization');

    console.log(`acsToken ${acsToken}`);
    return jwtHandler.verifyUsrToken(acsToken)
        .then(function (tokenPayload) {
            req.user = tokenPayload;
            var role = tokenPayload.role
            if (role = constants.ROLES.CLIENT) {
                next();
            } else {
                throw exceptions.unAuthenticatedAccess("User Is not client.");
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
    isSuperAdmin,
    isClient,
    isAdmin

};

//========================== Export Module End ===========================

