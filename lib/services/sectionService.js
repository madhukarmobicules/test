/**
 * Created by madhukar on 23/6/17.
 */

//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

//Load JWt Service
const jwtHandler = require('../jwtHandler');
const appUtils = require('../appUtils');
const exceptions = require("../customExceptions");
const appConstants = require("../constants");
const sectionDao = require("../dao/sectionDao");

function addSection(query , param) {
    return sectionDao.executeQuery(query ,param)
}

function executeMultiQuery(query , param) {
    return sectionDao.executeMultiQuery(query ,param)
}

function executeQuery(query , param ) {
    return sectionDao.executeQuery(query ,param)
}

//========================== Export Module Start ===========================

module.exports = {
    addSection,
    executeMultiQuery,
    executeQuery
};

//========================== Export module end ==================================



