/**
 * Created by madhukar on 30/6/17.
 */
var baseDao = require('./../baseDao');
const db = baseDao.db;


function executeQuery(query , parameter) {
    return db.one( query , parameter)
}

module.exports = {
    executeQuery

};

