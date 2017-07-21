/**
 * Created by madhukar on 30/6/17.
 */
const questionTestDao = require("../../dao/test/questionTestDao");

/**
 *
 * @param query
 * @param param
 */
function truncateTables(query , param) {
    questionTestDao.executeQuery(query , param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return questionTestDao.executeQuery(query , param)
}

//========================== Export Module Start ===========================

module.exports = {
    truncateTables,
    executeQuery
};
