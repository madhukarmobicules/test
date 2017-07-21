/**
 * Created by madhukar on 30/6/17.
 */
const sectionTestDao = require("../../dao/test/sectionTestDao");

/**
 *
 * @param query
 * @param param
 */
function truncateTables(query , param) {
    sectionTestDao.executeQuery(query , param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return sectionTestDao.executeQuery(query , param)
}


function addSection(query , param) {
    return sectionTestDao.executeQuery(query ,param)
}
//========================== Export Module Start ===========================

module.exports = {
    truncateTables,
    executeQuery,
    addSection
};
