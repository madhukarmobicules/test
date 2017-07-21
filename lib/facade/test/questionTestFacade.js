/**
 * Created by madhukar on 30/6/17.
 */
//========================== Load Modules Start =======================
const _ = require("lodash"),
    appUtils = require('../../appUtils'),
    appConstants = require('../../constants');

//========================== Load internal modules ====================

const questionTestService = require('../../services/test/questionTestService'),
    exceptions = require('../../customExceptions');
//========================== Load Modules End ==============================================


function deleteAllTestData() {
    var query = "truncate table question_test ";
    var param = []
    questionTestService.truncateTables(query ,param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return questionTestService.executeQuery(query , param)
}

module.exports = {
    deleteAllTestData,
    executeQuery
}
