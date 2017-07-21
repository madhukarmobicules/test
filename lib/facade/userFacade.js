/**
 * Created by madhukar on 1/6/17.
 */

"use strict";

//========================== Load Modules Start =======================

const _ = require("lodash"),
    appUtils = require('../appUtils'),
    appConstants = require('../constants');
var RenderMaster = require('../renderer-es6');
var Promise = require("bluebird");


//========================== Load internal modules ====================

// Load user service
const usrService = require('../services/userService'),
    exceptions = require('../customExceptions'),
    jwtHandler = require('../jwtHandler'),
    emailService = require('../services/emailService'),
    caseService = require('../services/caseService');


//========================== Load Modules End ==============================================
/**
 * Register user
 * @param userData
 * @returns {Request}
 */
function registerUser(userData) {
    var email = userData.email;
    var password = userData.password;
    var createdat = appUtils.currentUnixTimeStamp();
    var updatedat = new Date();
    var role = userData.role;
    var status = appConstants.STATUS.UNVERIFIED

    //check for user email
    var query = "select count(id) from users where email=$1";
    var parameter = [email];
    return usrService.getUserByQuery(query, parameter)
        .then(function (data) {
            if (data['count'] != '0') {
                throw exceptions.emailAlrdyRegistered(appConstants.MESSAGES.emailAlrdyRegistered)
            } else {
                var insertQuery = "insert into users(email,password,createdat,updatedat,role , status) values($1,$2,$3,$4 , $5 , $6) returning id";
                var parm = [email, password, createdat, updatedat, role, status];
                return usrService.addNewUser(insertQuery, parm)
            }
        })
        .then(function (data) {
            var userData = {id: data.id, email: email, role: role};
            return jwtHandler.genJWTToken(userData)

        })
        .then(function (token) {
            var verificationToken = token;
            var updateQuery = "update users SET emailverificationtoken = $1 , accesstoken = $2 where email=$3 returning id";
            var updateParam = [verificationToken, verificationToken, email];
            //Send verification mail
            emailService.sendEmailVerificationLink(verificationToken, email)
            return usrService.updateUser(updateQuery, updateParam);
        })
        .then(function (updateData) {
            var query = "select * from users where email = $1;"
            var paramData = [email];
            return usrService.getUserByQuery(query, paramData);
        })
}

/**
 *For email verification
 * @param token
 * @returns {*}
 */
function verifyEmail(token) {
    var query = "select id , status  from users where emailverificationtoken = $1";
    var param = [token]
    return usrService.getUserByQuery(query, param)
        .then(function (user) {
            if (user && user.status == 2) {
                throw exceptions.emailAlreadyVerified(appConstants.MESSAGES.emailAlreadyVerified);
            } else {
                // verify email
                var query = "update users SET status = $1 where id = $2 returning id"
                var param = [appConstants.STATUS.ACTIVE, user.id]
                return usrService.updateUser(query, param)
            }

        })
        .catch(function (data) {
            throw exceptions.invalidToken(appConstants.MESSAGES.invalidToken)
        })
}


/**
 * Resend Verification link
 * @param email
 * @returns {Request}
 */
function resendVerificationLink(email) {
    var query = "select  id , status  from users where email = $1";
    var param = [email]
    var obj = {};
    return usrService.getUserByQuery(query, param)
        .then(function (data) {
            if (data.status == appConstants.STATUS.ACTIVE) {
                obj.alreadyVerified = 1;
                obj.message = appConstants.MESSAGES.emailAlreadyVerified;
                return obj;
            } else {
                var userData = {id: data.id, email: email};
                return jwtHandler.genJWTToken(userData)
            }

        })
        .then(function (token) {
            if (token && token.alreadyVerified == 1) {
                return token
            } else {
                var verificationToken = token;
                var updateQuery = "update users SET emailverificationtoken = $1  where email=$2 returning id";
                var updateParam = [verificationToken, email];
                //Send verification mail
                emailService.sendEmailVerificationLink(verificationToken, email)
                return usrService.updateUser(updateQuery, updateParam);
            }

        })
        .then(function (updateData) {
            if (updateData && updateData.alreadyVerified == 1) {
                return updateData
            } else {
                var data = {}
                data.email = email;
                data.message = appConstants.MESSAGES.resendVerificationLink
                return data;
            }
        })
        .catch(function (data) {
            throw exceptions.someThingWrong(appConstants.MESSAGES.someThingWrong)
        })


}

/**
 * login user
 * @param loginData
 * @returns {*}
 */
function login(loginData) {
    //check for user email
    var email = loginData.email
    var obj = {};
    var password = loginData.password
    var query = "select id , password ,role , wcnumber , status from users where email=$1";
    var parameter = [email];
    return usrService.getUserByQuery(query, parameter)
        .then(function (data) {
            if (data) {
                if (!(password == data['password'])) {
                    var number = data.wcnumber + 1;
                    if (number >= 3) {
                        var query = "UPDATE users set wcnumber = $1 , status = $2 where email = $3";
                        var param = [number, appConstants.STATUS.SUSPENDED, email]
                        usrService.updateUser(query, param);
                        //suspended = 1;
                        obj.status = 3;
                        obj.message = appConstants.MESSAGES.accountSuspended;
                        return obj;
                        // throw exceptions.accountSuspended(appConstants.MESSAGES.accountSuspended)
                    } else {
                        var query = "UPDATE users set wcnumber = $1 where email = $2";
                        var param = [number, email]
                        usrService.updateUser(query, param);
                        throw exceptions.wrongCredentials(appConstants.MESSAGES.wrongPassword)
                    }
                } else {
                    if (data.status == appConstants.STATUS.UNVERIFIED) {
                        obj.status = 1;
                        obj.email = email;
                        obj.message = appConstants.MESSAGES.emailNotVerified;
                        return obj;
                    } else {
                        if (data.status == appConstants.STATUS.SUSPENDED) {
                            // suspended
                            obj.status = 3;
                            obj.message = appConstants.MESSAGES.accountSuspended;
                            return obj;
                            // throw exceptions.suspendedAccount(appConstants.MESSAGES.suspendedAccount)
                        } else {
                            var userData = {id: data['id'], email: email, role: data.role};
                            return jwtHandler.genJWTToken(userData)
                        }
                    }
                }
            } else {
                throw exceptions.actNotRecognised(appConstants.MESSAGES.actNotRecognised())
            }

        })
        .then(function (accessToken) {
            if (accessToken && accessToken.status) {
                return accessToken
            } else {
                var updateQuery = "update users SET accesstoken = $1 , wcnumber = $2 where email=$3 returning id";
                var count = 0;
                var updateParam = [accessToken, count, email];
                return usrService.updateUser(updateQuery, updateParam);
            }

        })
        .then(function (updateData) {
            if (updateData && updateData.status) {
                return updateData
            } else {
                var query = "select * from users where email = $1;"
                var paramData = [email];
                return usrService.getUserByQuery(query, paramData);
            }

        })
        .catch(function (err) {
            throw exceptions.actNotRecognised(appConstants.MESSAGES.actNotRecognised)
        })

}

/**
 * Logout user
 * @param id
 * @returns {*}
 */
function logout(id) {
    var updateQuery = "update users SET accesstoken = $1 where id=$2 returning id";
    var updateParam = ["", id];
    return usrService.updateUser(updateQuery, updateParam);
}


/**
 * for forgot password
 * @param userData
 * @returns {Request}
 */
function forgotPassword(userData) {
    var email = userData.email;
    var query = "select id , email ,role from users where email = $1";
    var param = [email]
    return usrService.getUserByQuery(query, param)
        .then(function (user) {
            if (user) {
                if (user.status == appConstants.STATUS.ACTIVE || user.status == appConstants.STATUS.SUSPENDED) {
                    throw exceptions.cntRestPassword(appConstants.MESSAGES.cntRestPassword);
                } else {
                    var tokenData = {id: user.id, email: user.email, role: user.role};
                    return jwtHandler.genJWTToken(userData)
                }
            } else {
                throw exceptions.noUserFoundForForgot(appConstants.MESSAGES.noUserFoundForForgot);
            }
        })
        .then(function (resetPasswordToken) {
            var query = "update users SET resetpasswordtoken = $1 where email = $2 returning id";
            var param = [resetPasswordToken, email];
            emailService.sendForgotPasswordLink(resetPasswordToken, email);
            return usrService.updateUser(query, param);
        })
        .then(function (updateData) {
            var query = "select * from users where email = $1;"
            var paramData = [email];
            return usrService.getUserByQuery(query, paramData);
        })
        .catch(function (err) {
            throw exceptions.actNotRecognised();
        })
}


/**
 * Reset password
 * @param resetPasswordToken
 * @param password
 * @returns {Request|Promise|*}
 */
function resetPassword(resetPasswordToken, password) {
    var id;
    var query = "select id from users where resetpasswordtoken = $1"
    var param = [resetPasswordToken]
    return usrService.getUserByQuery(query, param)
        .then(function (user) {
            if (user) {
                var updateQuery = "UPDATE users SET password = $1 , resetpasswordtoken = $2  where id = $3 returning id";
                var data = ''
                var param = [password, data, user.id]
                id = user.id;
                return usrService.updateUser(updateQuery, param);
            } else {
                throw exceptions.actNotRecognised();
            }
        })
        .then(function (updateData) {
            var query = "select * from users where id = $1;"
            var paramData = [id];
            return usrService.getUserByQuery(query, paramData);
        })
        .catch(function (err) {
            throw exceptions.resetTokenIsInvalid();
        })
}

/**
 * for changes password
 * @param userId
 * @param password
 * @returns {Request|Promise|*}
 */
function changePassword(id, cpassword, nPassword) {
    var query = "select id , password from users where id = $1";
    var param = [id]
    return usrService.getUserByQuery(query, param)
        .then(function (user) {
            if (user) {
                if (user.password == cpassword) {
                    var updateQuery = "UPDATE users SET password = $1 where id = $2 returning id";
                    var updateParam = [nPassword, id]
                    return usrService.updateUser(updateQuery, updateParam);
                } else {
                    throw exceptions.passwordNotMatched();
                }

            } else {
                throw exceptions.actNotRecognised();
            }
        })
        .then(function (updateData) {
            var query = "select * from users where id = $1;"
            var paramData = [id];
            return usrService.getUserByQuery(query, paramData);
        })
}

function getDashborad(uid) {
    // get cases  by user id
    // no of breif downlkoad
    // expiary time
    var dashboardData = {};
    let query = "select * from users where id = $1";
    var param = [uid];
    let currentTime = new Date();
    return usrService.executeQuery(query, param)
        .then(function (userData) {
            if (userData.lastquestionid) {
                dashboardData.isQuestionSubmitted = true;
                dashboardData.lastSubmittedQuestion = userData.lastquestionid;
                dashboardData.lastQuestionSectionId = userData.lastquestionsection
            } else {
                dashboardData.lastSubmitedTime = userData.qualifysubmittime;
                dashboardData.isQuestionSubmitted = false;
            }
            let query = "select * from cases where uid = $1";
            let param = [uid]
            return caseService.executeQuery(query, param);
        })
        .then(function (caseData) {
            let caseExpiryTime = caseData.expiry;
            dashboardData.caseExpiryTime = caseExpiryTime
            if (caseExpiryTime <= currentTime) {
                dashboardData.isCaseExpired = true;
            } else {
                dashboardData.isCaseExpired = false;
            }
            if (caseData.briefdownloads && caseData.briefdownloads < 4) {
                dashboardData.isDownloadBrief = true;
            } else {
                dashboardData.isDownloadBrief = false;
            }
            // need to do calculation for all section
            return 1;
        })
        .then(function (data) {
            /**
             * TODO REMOVE HARDCODING
             */
            var obj = {
                "3": 40,
                "4": 40,
                "5": 40,
                "6": 40,
                "7": 40,
                "8": 40,
                "9": 40,
                "10": 40
            }
            dashboardData.precentageMap = obj;
            return dashboardData;

        })

}

/**
 *



 C_NAME1 : 1 ,
 C_NAME2 : 617,
 P_NAME1 : 6 ,
 P_NAME2: 617 ,
 C_AGE : 3 ,
 P_AGE : 8,
 C_AUSIS_CITIZEN :4,
 P_AUSIS_CITIZEN :9,
 C_AUSIS_RESI :5,
 P_AUSIS_RESI :10,
 C_CURRENT_HEALTH_STATUS : 41  ,
 P_CURRENT_HEALTH_STATUS :  51,
 C_H_I_EMPLOYMENT : 42 ,
 P_H_I_EMPLOYMENT : 52,
 C_U_OCCU : 34,
 P_U_OCCU : 47,
 C_UN_EMPLOYED : 37 ,
 P_UN_EMPLOYED : 1000,
 C_RE_PARTNERED : 62 ,
 P_RE_PARTNERED : 70,
 C_DV_ALLIGATION_BY : 76 ,
 P_DV_ALLIGATION_BY : 68,
 * @param uid
 * @returns {Request}
 */
function generateBriefPdf(uid) {
    uid = 1;
    var promise;
    var briefData = {};
    var renderer = new RenderMaster();
    //for getting case refrence
    var query = "";
    //  var caseQuery = "select cid from case where uid = $1";
    var param = [uid]
    /*return caseService.executeQuery(caseQuery ,param)
     .then(function (data) {
     briefData.caseRef = data.cid;*/
    // period of cohabitation
    var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.PERIOD_OF_COHABITATION;
    return usrService.executeQuery(pQuery, param)
    //  })
        .then(function (periodofcohabitation) {
            /**
             * TODO
             * need to format date
             * @type {Date}
             */
            var currentDate = new Date();
            if (periodofcohabitation && periodofcohabitation.answer) {
                briefData.periodofcohabitation = currentDate - periodofcohabitation.answer;
            }
            //Prenuptial Agreement:
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.PRENUPTIAL_AGREEMENT;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (prenuptialAgreement) {
            if (prenuptialAgreement && prenuptialAgreement.answer) {
                briefData.prenuptialAgreement = prenuptialAgreement.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.DATE_OF_SEPRATION1;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (dateOfSepration1) {
            if (dateOfSepration1 && dateOfSepration1.answer) {
                briefData.dateOfSepration1 = dateOfSepration1.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.DATE_OF_SEPRATION2;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (dateOfSepration2) {
            if (dateOfSepration2 && dateOfSepration2.answer) {
                briefData.dateOfSepration2 = dateOfSepration2.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.RELATIONSHIP_TYPE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (relationType) {
            if (relationType && relationType.answer) {
                briefData.relationType = relationType.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.MARRIAGE_DATE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (marriageDate) {
            if (marriageDate && marriageDate.answer) {
                briefData.marriageDate = marriageDate.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.DIVORCE_DATE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (divorceDate) {
            if (divorceDate && divorceDate.answer) {
                briefData.divorceDate = divorceDate.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_CURRENT_RELATIONSHIP_W_F_P;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cCurrentRWFP) {
            if (cCurrentRWFP && cCurrentRWFP.answer) {
                briefData.cCurrentRWFP = cCurrentRWFP.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.PROPERTY_SETTELMENT;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (propertySettelMent) {
            if (propertySettelMent && propertySettelMent.answer) {
                briefData.propertySettelMent = propertySettelMent.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.CHILED_MAINTENENCE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (childMaintenence) {
            if (childMaintenence && childMaintenence.answer) {
                briefData.childMaintenence = childMaintenence;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.PARENTING_ORDER;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (parentingOrder) {
            if (parentingOrder && parentingOrder.answer) {
                briefData.parentingOrder = parentingOrder.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.SPOUSE_MAINTENENCE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (spouseMaintenence) {
            if (spouseMaintenence && spouseMaintenence.answer) {
                briefData.spouseMaintenence = spouseMaintenence.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.DOMESTIC_VOILENCE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (domesticVoilence) {
            if (domesticVoilence && domesticVoilence.answer) {
                briefData.domesticVoilence = domesticVoilence.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.OTHER_PROCEDINGS;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (otherProceedings) {
            if (otherProceedings && otherProceedings.answer) {
                briefData.otherProceedings = otherProceedings.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_NAME1;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cName1) {
            if (cName1 && cName1.answer) {
                briefData.cName1 = cName1.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_NAME2;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cName2) {
            if (cName2 && cName2.answer) {
                briefData.cName2 = cName2.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_NAME1;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pName1) {
            if (pName1 && pName1.answer) {
                briefData.pName1 = pName1.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_NAME2;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pName2) {
            if (pName2 && pName2.answer) {
                briefData.pName2 = pName2.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.CHILED_MAINTENENCE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (childMaintenence) {
            if (childMaintenence && childMaintenence.answer) {
                briefData.childMaintenence = childMaintenence.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_AGE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cAge) {
            if (cAge && cAge.answer) {
                briefData.cAge = cAge.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_AUSIS_CITIZEN;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cAusisCitizen) {
            if (cAusisCitizen && cAusisCitizen.answer) {
                briefData.cAusisCitizen = cAusisCitizen.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_AUSIS_CITIZEN;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pAusisCitizen) {
            if (pAusisCitizen && pAusisCitizen.answer) {
                briefData.pAusisCitizen = pAusisCitizen.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_AUSIS_RESI;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cAusisResi) {
            if (cAusisResi && cAusisResi.answer) {
                briefData.cAusisResi = cAusisResi.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_AUSIS_RESI;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pAusisResi) {
            if (pAusisResi && pAusisResi.answer) {
                briefData.pAusisResi = pAusisResi.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_CURRENT_HEALTH_STATUS;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cCrrentHealthStatus) {
            if (cCrrentHealthStatus && cCrrentHealthStatus.answer) {
                briefData.cCrrentHealthStatus = cCrrentHealthStatus.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_CURRENT_HEALTH_STATUS;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pCrrentHealthStatus) {
            if (pCrrentHealthStatus && pCrrentHealthStatus.answer) {
                briefData.pCrrentHealthStatus = pCrrentHealthStatus.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_H_I_EMPLOYMENT;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (chiEmployment) {
            if (chiEmployment && chiEmployment.answer) {
                briefData.chiEmployment = chiEmployment.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_H_I_EMPLOYMENT;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (phiEmployment) {
            if (phiEmployment && phiEmployment.answer) {
                briefData.phiEmployment = phiEmployment.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_U_OCCU;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cuOccupation) {
            if (cuOccupation && cuOccupation.answer) {
                briefData.cuOccupation = cuOccupation.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_U_OCCU;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (puOccupation) {
            if (puOccupation && puOccupation.answer) {
                briefData.puOccupation = puOccupation.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_UN_EMPLOYED;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cUnEmployed) {
            if (cUnEmployed && cUnEmployed.answer) {
                briefData.cUnEmployed = cUnEmployed.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_UN_EMPLOYED;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pUnEmployed) {
            if (pUnEmployed && pUnEmployed.answer) {
                briefData.pUnEmployed = pUnEmployed.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_RE_PARTNERED;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cRePartined) {
            if (cRePartined && cRePartined.answer) {
                briefData.cRePartined = cRePartined.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_RE_PARTNERED;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pRePartined) {
            if (pRePartined && pRePartined.answer) {
                briefData.pRePartined = pRePartined.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.C_DV_ALLIGATION_BY;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (cDVAliigationBy) {
            if (cDVAliigationBy && cDVAliigationBy.answer) {
                briefData.cDVAliigationBy = cDVAliigationBy.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.P_DV_ALLIGATION_BY;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (pDVAliigationBy) {
            if (pDVAliigationBy && pDVAliigationBy.answer) {
                briefData.pDVAliigationBy = pDVAliigationBy.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.R_N_F_CHILDCARE;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (rnfChildcare) {
            if (rnfChildcare && rnfChildcare.answer) {
                briefData.rnfChildcare = rnfChildcare.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.R_N_F_HOMEMAKING;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (rnfHomeMaking) {
            if (rnfHomeMaking && rnfHomeMaking.answer) {
                briefData.rnfHomeMaking = rnfHomeMaking.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.R_N_F_P_RENOVATION;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (rnfpRenovation) {
            if (rnfpRenovation && rnfpRenovation.answer) {
                briefData.rnfpRenovation = rnfpRenovation.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.R_N_F_UNPAID_WORK;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (rnfUnpaidWork) {
            if (rnfUnpaidWork && rnfUnpaidWork.answer) {
                briefData.rnfUnpaidWork = rnfUnpaidWork.answer;
            }
            var pQuery = "select answer  from user_answer where uid = $1 and qid = " + appConstants.QID.S_N_F_P_RENOVATION;
            return usrService.executeQuery(pQuery, param)
        })
        .then(function (snfpRenovation) {
            if (snfpRenovation && snfpRenovation.answer) {
                briefData.snfpRenovation = snfpRenovation.answer;
            }
            query = "select answer from user_answer where uid = $1 and qid in (290,298,327,333,350,370,397) ";
            return usrService.clientAtCommAssetValue(query, param)
        })

        .then(function (clientAtCommAssetValue) {
            var value = 0
            _.each(clientAtCommAssetValue, function (data) {
                value = value + parseInt(data.answer);
            })
            briefData.clientAtCommAssetValue = value;
            query = "select answer from user_answer where uid = $1 and qid in (302 ,311 , 336	,337 ,344 ,345 ,353 ,354 ,361 ,362 ,375 ,376 ,408 ,409 ,414 ,415) ";
            var param = [uid]
            return usrService.clientDuringContribution(query, param)
        })
        .then(function (clientDuringContribution) {
            var value = 0;
            _.each(clientDuringContribution, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.clientDuringContribution = value;
            query = "select answer from user_answer where uid = $1 and qid in (306	,316 ,391) ";
            var param = [uid]
            return usrService.clientPostSepContributionsSum(query, param)
        })
        .then(function (clientPostSepContributionsSum) {
            var value = 0;
            _.each(clientPostSepContributionsSum, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.clientPostSepContributionsSum = value;
            query = "select answer from user_answer where uid = $1 and qid in (421 , 427 , 430) ";
            var param = [uid]
            return usrService.clientDuringWindFalls(query, param)
        })
        .then(function (clientDuringWindFalls) {
            var value = 0;
            _.each(clientDuringWindFalls, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.clientDuringWindFalls = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (424 , 433) ";
            return usrService.clientPostSepWindFalls(query, param)
        })
        .then(function (clientPostSepWindFalls) {
            var value = 0;
            _.each(clientPostSepWindFalls, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.clientPostSepWindFalls = value;
            query = "select answer from user_answer where uid = $1 and qid in (286 ,294 ,321 ,342 ,359 ,387 ,400) ";
            var param = [uid]
            return usrService.clientCurrentAssets(query, param)
        })
        .then(function (clientCurrentAssets) {
            var value = 0;
            _.each(clientCurrentAssets, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.clientCurrentAssets = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (440) ";
            return usrService.clientCurrentLiablities(query, param)
        })
        .then(function (clientCurrentLiablities) {
            var value = 0;
            _.each(clientCurrentLiablities, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.clientCurrentLiablities = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (456 , 464 , 493,499,516,536,563) ";
            return usrService.partnerAtAcommAssetValue(query, param)
        })
        .then(function (partnerAtAcommAssetValue) {
            var value = 0;
            _.each(partnerAtAcommAssetValue, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerAtAcommAssetValue = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (468 ,477 ,502 ,503 ,510 ,511 ,519 ,520 ,527 ,528	,541 ,542,574 ,575 ,580,581) ";
            return usrService.partnerDuringContributionsSum(query, param)
        })
        .then(function (partnerDuringContributionsSum) {
            var value = 0;
            _.each(partnerDuringContributionsSum, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerDuringContributionsSum = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (472 ,482	 ,557) ";
            return usrService.partnerPostSepContribution(query, param)
        })
        .then(function (partnerPostSepContribution) {
            var value = 0;
            _.each(partnerPostSepContribution, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerPostSepContribution = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (587 ,593	,596) ";
            return usrService.parntnerDuringWindFalls(query, param)
        }).then(function (parntnerDuringWindFalls) {
            var value = 0;
            _.each(parntnerDuringWindFalls, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.parntnerDuringWindFalls = value;
            var param = [uid]
            query = "select answer from user_answer where uid = $1 and qid in (590,599) ";
            return usrService.partnerPostSepWindFalls(query, param)
        })
        .then(function (partnerPostSepWindFalls) {
            var value = 0;
            _.each(partnerPostSepWindFalls, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerPostSepWindFalls = value;
            var param = [uid];
            query = "select answer from user_answer where uid = $1 and qid in (452 ,460	 ,487 ,508 ,525	 ,553 ,566) ";
            return usrService.partnerCurrentAssets(query, param)
        })
        .then(function (partnerCurrentAssets) {
            var value = 0;
            _.each(partnerCurrentAssets, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerCurrentAssets = value;
            query = "select answer from user_answer where uid = $1 and qid in (605) ";
            var param = [uid]
            return usrService.partnerCurrentLiabilities(query, param)
        }).then(function (partnerCurrentLiabilities) {
            var value = 0;
            _.each(partnerCurrentLiabilities, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerCurrentLiabilities = value;
            query = "select answer from user_answer where uid = $1 and qid in (290,298,327,333,350,370,397) ";
            var param = [uid]
            return usrService.partnerPostSepWindFalls(query, param)
        })
        .then(function (partnerPostSepWindFalls) {
            var value = 0;
            _.each(partnerPostSepWindFalls, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.partnerPostSepWindFalls = value;
            query = "select answer from user_answer where uid = $1 and qid in (217 ,222 ,228 ,236 ,257 ,265) ";
            var param = [uid];
            return usrService.jointCurrentAssets(query, param)
        })
        .then(function (jointCurrentAssets) {
            var value = 0;
            _.each(jointCurrentAssets, function (data) {
                value = value + parseInt(data.answer)
            })
            briefData.jointCurrentAssets = value;
            briefData.jointCurrentLiabilities = value
            briefData.jointPostSepContribution = value

           // promise = Promise.resolve(briefData)
              return briefData;
            /*return promise.then(function (data) {
             return renderer.renderAndSave('dashboard.handlebars',  'dashboard', {
             name: "name"
             });
             });*/
        })
        .then(function (briefData) {
            return renderer.renderAndSave('dashboard.handlebars', 'dashboard', {name :"na"});
        })
}

function generateBriefPdaf() {
    var renderer = new RenderMaster();
    var promise = Promise.resolve(true)

    return promise.then(function (data) {
        return renderer.renderAndSave('dashboard.handlebars', 'dashboard', {
            name: "name"
        });
    });
}

/**
 *Accept term and condition
 * @param uid
 * @returns {Promise|Request|Promise.<TResult>|*}
 */
function tncAccept(uid) {
    var query = "select id , password from users where id = $1";
    var param = [uid]
    return usrService.getUserByQuery(query, param)
        .then(function (user) {
            if (user) {
                var query = "update user set status = $1 where id = $2"
                var param = [appConstants.STATUS.TNC_ACCEPTED , uid]
                return userService.updateUser(query , param);

            } else {
                throw exceptions.actNotRecognised();
            }
        })
        .then(function (updateData) {
            var query = "select * from users where id = $1;"
            var paramData = [uid];
            return usrService.getUserByQuery(query, paramData);
        })

}

function getQualifyingError(uid) {
 let query= "select status , qerror from users where id = $1";
 let param = [uid];
 return usrService.executeQuery(query , param)
     .then(function (data) {
       if(data.status == appConstants.STATUS.UNSUCCESSFULL_QUALIFICATION)  {
            return data.qerror;
       }else{
           throw exceptions.notSuccessFullQualification(appConstants.MESSAGES.notSuccessFullQualification);
       }
     })



}

module.exports = {
    registerUser,
    resendVerificationLink,
    verifyEmail,
    login,
    logout,
    resetPassword,
    changePassword,
    forgotPassword,
    getDashborad,
    //getBrief,
    generateBriefPdf,
    tncAccept,
    getQualifyingError
}


