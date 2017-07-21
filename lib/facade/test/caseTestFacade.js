/**
 * Created by madhukar on 30/6/17.
 */
//========================== Load Modules Start =======================
const _ = require("lodash"),
    appUtils = require('../../appUtils'),
    appConstants = require('../../constants');

//========================== Load internal modules ====================

const caseTestService = require('../../services/test/caseTestService'),
    exceptions = require('../../customExceptions');
//========================== Load Modules End ==============================================


function deleteAllTestData() {
    var query = "truncate table case_test ";
    var param = []
    caseTestService.truncateTables(query ,param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return caseTestService.executeQuery(query , param)
}

module.exports = {
    deleteAllTestData,
    executeQuery
}
