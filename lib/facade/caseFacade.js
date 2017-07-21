/**
 * Created by madhukar on 27/6/17.
 */
"use strict";

//========================== Load Modules Start =======================

const _ = require("lodash"),
    appUtils = require('../appUtils'),
    appConstants = require('../constants');


//========================== Load internal modules ====================

// Load user service
const caseService = require('../services/caseService'),
    exceptions = require('../customExceptions'),
    jwtHandler = require('../jwtHandler'),
    emailService =  require('../services/emailService'),
    userService =  require('../services/userService');

/**
 * Create case for the user
 * @param uid
 */
function createCase(uid) {
    var query = "select count(id) from cases where uid = $1 ";
    var param = [uid];
    var createdat = appUtils.currentUnixTimeStamp();
    var updatedat = new Date();
    return caseService.executeQuery(query , param)
        .then(function (data) {
            if(data && data.count && parseInt(data.count)){
                throw exceptions.caseAlreadyCreated(appConstants.MESSAGES.caseAlreadyCreated)
            }else{
                var cid = "user"+createdat;
                var briefdownloads = 0;
                var expiry = createdat + appConstants.TIME.ONE_YEAR;
                var fquestion = false;
                var insertQuery = "insert into cases(cid,uid,createdat,updatedat,briefdownloads , expiry , fquestion ) values($1,$2,$3,$4 , $5 , $6,$7) returning id";
                var parm = [cid, uid, createdat, updatedat ,briefdownloads,expiry,fquestion];
                return caseService.addNewCase(insertQuery , parm)
            }
        })
        .then(function (data) {
            //update user status
            var query = "update users set status = $1 where id = $2 returning id"
            var param = [appConstants.STATUS.TEST_CASE_CREATED , uid]
            return userService.updateUser(query , param);
        })
        .then(function (data) {
            var query = "select * from users where id = $1;"
            var paramData = [uid];
            return userService.getUserByQuery(query, paramData);
        })


}


module.exports = {
    createCase
}
