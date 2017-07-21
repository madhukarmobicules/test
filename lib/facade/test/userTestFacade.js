/**
 * Created by madhukar on 13/6/17.
 */

"use strict";

//========================== Load Modules Start =======================
const _ = require("lodash"),
    appUtils = require('../../appUtils'),
    appConstants = require('../../constants');

//========================== Load internal modules ====================

const testService = require('../../services/test/userTestService'),
    exceptions = require('../../customExceptions');
//========================== Load Modules End ==============================================

/**
 * Truncate test user table
 */
function deleteAllTestData() {
    var query = "truncate table users_test ";
    var param = []
    testService.truncateTables(query ,param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return testService.executeQuery(query , param)
}

module.exports = {
    deleteAllTestData,
    executeQuery
}