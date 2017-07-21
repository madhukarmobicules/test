/**
 * Created by madhukar on 30/6/17.
 */
const caseTestDao = require("../../dao/test/caseTestDao");

/**
 *
 * @param query
 * @param param
 */
function truncateTables(query , param) {
    caseTestDao.executeQuery(query , param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return caseTestDao.executeQuery(query , param)
}

//========================== Export Module Start ===========================

module.exports = {
    truncateTables,
    executeQuery
};
