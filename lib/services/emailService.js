"use strict";

//========================== Load Modules Start =======================

//========================== Load external modules ====================


var urlencode = require('urlencode');
//========================== Load internal modules ====================

const appUtils = require('../appUtils'),
     appConst = require('../constants'),
     emailHandler = require('../emailHandler'),
     emailUtil = require('../emailUtils'),
     envConfig = require("../config/index");


//========================== Load Modules End ==============================================

/**
 * Send email verification link
 * @param verificationToken
 * @param email
 */
function sendEmailVerificationLink(verificationToken , email) {
    var emailMessage = {};
   // email = "madhukar.pandey@mobicules.com"
    if (verificationToken) {
        var link = envConfig.env.webBaseUrl +"/legal-logix-web/verifyEmail?token=" + verificationToken;
        emailMessage.substitutes = [{key: "-email-", value: email},  {key: "-link-", value: link}];
        emailMessage.receiverEmail = email;
       // emailMessage.receiverName = user.name;
        emailMessage.templateId = envConfig.env.templateIds.verifyEmail
        emailMessage.subject = "Verify Email"
    }
   emailUtil.sendMail(emailMessage);
}
/**
 * Send forgot password link
 * @param forgotPasswordToken
 * @param email
 */
function sendForgotPasswordLink(forgotPasswordToken , email) {
    var emailMessage = {};
    //email = "madhukar.pandey@mobicules.com"
    if (forgotPasswordToken) {
        var link = envConfig.env.webBaseUrl + "/legal-logix-web/resetPassword?resetPasswordToken=" + forgotPasswordToken;
        emailMessage.substitutes = [{key: "-email-", value: email},  {key: "-link-", value: link}];
        emailMessage.receiverEmail = email;
        // emailMessage.receiverName = user.name;
        emailMessage.templateId = envConfig.env.templateIds.forgotPass
        emailMessage.subject = "Forgot Password"
    }
    emailUtil.sendMail(emailMessage);
}

function sendPasswordSetEmail(setPasswordToken , email){
    var emailMessage = {};
   // email = "madhukar.pandey@mobicules.com"
    if (setPasswordToken) {
        var link = envConfig.env.baseURL + "/admin/password/set?setPasswordToken=" + setPasswordToken;
        emailMessage.substitutes = [{key: "-email-", value: email},  {key: "-link-", value: link}];
        emailMessage.receiverEmail = email;
        // emailMessage.receiverName = user.name;
        emailMessage.templateId = envConfig.env.templateIds.setAdminPassword
        emailMessage.subject = "Set Password"
    }
    emailUtil.sendMail(emailMessage);
}


function sendRedFlagEmail( userEmail , userId , userCase){
    var emailMessage = {};
    /**
     * TODO
     * @type {string}
     */
     //userEmail = "madhukar.pandey@mobicules.com"
        var link = envConfig.env.baseURL + "/admin/case"
        emailMessage.substitutes = [/*{key: "-userid-", value: userId},*/  /*{key: "-link-", value: link} ,*/ {key: "-email-", value: userEmail} /*,{key: "-case", value: userCase}*/];
        emailMessage.receiverEmail = appConst.ADMIN_EMAIL;
        // emailMessage.receiverName = user.name;
        emailMessage.templateId = envConfig.env.templateIds.redFlag
        emailMessage.subject = "Set Password"
    emailUtil.sendMail(emailMessage);
}



//========================== Export Module Start ===========================

module.exports = {
    sendEmailVerificationLink,
    sendForgotPasswordLink,
    sendPasswordSetEmail,
    sendRedFlagEmail

};

//========================== Export module end ==================================
