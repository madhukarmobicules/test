/**
 * Created by madhukar on 8/6/17.
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
const questionDao = require("../dao/questionDao");

function addQuestion(query , param) {
   return questionDao.executeQuery(query ,param)
}

function executeMultiQuery(query , param) {
    return questionDao.executeMultiQuery(query ,param)
}

function executeQuery(query , param ) {
    return questionDao.executeQuery(query ,param)
}

//return usrDao.executeQuery(insertQuery , parameter );
//========================== Export Module Start ===========================

module.exports = {
    addQuestion,
    executeMultiQuery,
    executeQuery
};

//========================== Export module end ==================================


