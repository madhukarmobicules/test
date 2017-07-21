/**
 * Created by madhukar on 1/6/17.
 */
//========================== Load Modules Start =======================

//========================== Load external modules ====================

const _ = require("lodash");

//========================== Load internal modules ====================

// Load user dao
//Load JWt Service
const jwtHandler = require('../jwtHandler');
const appUtils = require('../appUtils');
const exceptions = require("../customExceptions");
const appConstants = require("../constants");
const usrDao = require("../dao/userDao");

//========================== Load Modules End ==============================================
/**
 *
 * @param userData
 * @returns {*}
 */
function addNewUser(insertQuery , parameter ) {
    return usrDao.executeQuery(insertQuery , parameter );
}

/**
 *
 * @param query
 * @param projection
 * @param optionsu
 * @returns {*}
 */
function getUserByQuery(query , parameter) {
    return usrDao.executeQuery(query , parameter )
}

/**
 *
 * @param query
 * @param update
 * @param option
 * @returns {*}
 */
function updateUser(query , parameter ) {
    return usrDao.executeQuery(query  , parameter);

}

/**
 *
 * @param query
 * @param projection
 * @param options
 * @returns {*}
 */
function getSingleUserByQuery(query , projection , options) {
    return usrDao.getSingleUserByQuery(query , projection , options)
}

/**
 *
 * @param query
 * @param projection
 * @param optionsu
 * @returns {*}
 */
function executeQuery(query, param) {
    return usrDao.executeQuery(query, param)
}
function executeMultiQuery(query, param) {
    return usrDao.executeMultiQuery(query, param)
}

function clientAtCommAssetValue(query, param) {
    return usrDao.executeMultiQuery(query, param)
}

function clientDuringContribution(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function clientPostSepContributionsSum(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function clientDuringWindFalls(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function clientPostSepWindFalls(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function clientCurrentAssets(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function clientCurrentLiablities(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function partnerAtAcommAssetValue(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function partnerDuringContributionsSum(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function partnerPostSepContribution(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function parntnerDuringWindFalls(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function partnerCurrentAssets(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function partnerCurrentLiabilities(query, param) {
    return usrDao.executeMultiQuery(query, param)
}

function jointCurrentAssets(query, param) {
    return usrDao.executeMultiQuery(query, param)
}
function partnerPostSepWindFalls(query, param) {
    return usrDao.executeMultiQuery(query, param)
}





//========================== Export Module Start ===========================

module.exports = {
    addNewUser,
    getUserByQuery,
    updateUser,
    getSingleUserByQuery,
    executeQuery,
    executeMultiQuery,
    clientAtCommAssetValue,
    clientDuringContribution,
    clientPostSepContributionsSum,
    clientDuringWindFalls,
    clientPostSepWindFalls,
    clientCurrentAssets,
    clientCurrentLiablities,
    partnerDuringContributionsSum,
    partnerPostSepContribution,
    parntnerDuringWindFalls,
    jointCurrentAssets,
    partnerCurrentAssets,
    partnerCurrentLiabilities,
    partnerPostSepWindFalls,
    partnerAtAcommAssetValue


}
//========================== Export module end ==================================
