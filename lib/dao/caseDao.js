/**
 * Created by madhukar on 27/6/17.
 */

var baseDao = require('./baseDao');
const db = baseDao.db;


/**
 *
 * @param query
 * @param parameter
 * @returns {*|XPromise<any>|external:Promise}
 */
function executeQuery(query , parameter) {
    return db.one( query , parameter)
}

function executeMultiQuery(query , parameter) {
    return db.query( query , parameter)
}

module.exports = {
    executeQuery,
    executeMultiQuery

};