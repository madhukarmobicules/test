/**
 * Created by madhukar on 13/6/17.
 */
//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load user dao
//Load JWt Service
const userTestDao = require("../../dao/test/userTestDao");

/**
 *
 * @param query
 * @param param
 */
function truncateTables(query , param) {
    userTestDao.executeQuery(query , param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return userTestDao.executeQuery(query , param)
}

//========================== Export Module Start ===========================

module.exports = {
    truncateTables,
    executeQuery
};

//========================== Export module end ==================================

