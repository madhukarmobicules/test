/**
 * Created by madhukar on 27/6/17.
 */
const _ = require("lodash");

//========================== Load internal modules ====================

//Load JWt Service
const jwtHandler = require('../jwtHandler');
const appUtils = require('../appUtils');
const exceptions = require("../customExceptions");
const appConstants = require("../constants");
const caseDao = require("../dao/caseDao");

//========================== Export Module Start ===========================
/**
 * Add new case
 * @param query
 * @param param
 * @returns {*|XPromise.<any>|external:Promise}
 */
function addNewCase(query , param) {
    return caseDao.executeQuery(query , param);
}


function executeQuery(query , param) {
   return caseDao.executeQuery(query , param);
}
module.exports = {
    addNewCase,
    executeQuery
};

//========================== Export module end ==================================


