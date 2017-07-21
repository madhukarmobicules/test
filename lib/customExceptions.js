//========================== Load Modules Start ===========================

//========================== Load Internal Module =========================

// Load exceptions
var constants = require("./constants");
var Exception = require("./model/Exception");

//========================== Load Modules End =============================

//========================== Export Module Start ==========================

module.exports = {
  intrnlSrvrErr: function (err) {
    return new Exception(1, "internal Server Error", err);
  }
  ,
    unAuthenticatedAccess : function (err) {
        return new Exception(2, "Unathorized access", err);
    },
    validationError: function (errMsg ,err) {
        return new Exception(3 , errMsg ? errMsg : constants.MESSAGES.requiredField , err);
    },
    emailAlrdyRegistered : function (errMsg ,err) {
        return new Exception(4 ,  errMsg ? errMsg : constants.MESSAGES.emailAlrdyRegistered , err);
    },
    wrongCredentials : function (errMsg , err) {
        return new Exception(5 ,  errMsg ? errMsg : constants.MESSAGES.wrongPassword, err);
    },
    actNotRecognised : function (errMsg ,err) {
        return new Exception(6 ,   errMsg ? errMsg : constants.MESSAGES.actNotRecognised, err);
    },
    passwordNotMatched : function (err) {
      return new Exception(7 , " password did not matched.")

    },
    emailAlreadyVerified : function (errMsg , err) {
        return new Exception(8 ,   errMsg ? errMsg : constants.MESSAGES.emailAlreadyVerified, err );

    },
    noUserFoundForForgot : function (errMsg , err , title) {
        return new Exception(9 , errMsg ? errMsg : constants.MESSAGES.noUserFoundForForgot , err , constants.MESSAGES.tital);
    },
    accountSuspended : function (errMsg , err ) {
        return new Exception(10 ,   errMsg ? errMsg : constants.MESSAGES.accountSuspended, err ,"Failed too many times.");
    },
    suspendedAccount : function (errMsg ,err) {
        return new Exception(11 ,   errMsg ? errMsg : constants.MESSAGES.suspendedAccount, err );
    },
    emailNotVerified : function (errMsg , err) {
        return new Exception(12 ,   errMsg ? errMsg : constants.MESSAGES.emailNotVerified, err );
    } ,
    someThingWrong : function (errMsg , err) {
        return new Exception(13 ,   errMsg ? errMsg : constants.MESSAGES.someThingWrong, err );
    },
    invalidToken : function (errMsg ,err) {
        return new Exception(14 ,   errMsg ? errMsg : constants.MESSAGES.invalidToken, err );
    },
    notAdmin : function (errMsg , err) {
        return new Exception(15 ,   errMsg ? errMsg : constants.MESSAGES.notAdmin, err );
    },
    userAlreadyAdded : function (errMsg , err) {
        return new Exception(16 ,   errMsg ? errMsg : constants.MESSAGES.userAlreadyAdded, err );
    },
    passwordAlreadySet : function (errMsg , err) {
        return new Exception(17 ,   errMsg ? errMsg : constants.MESSAGES.passwordAlreadySet, err );
    },
    conflictOfInterest : function (errMsg , err) {
        return new Exception(18 ,   errMsg ? errMsg : constants.MESSAGES.conflictOfInterest, err );
    },
    prenuptialAgreement : function (errMsg , err) {
        return new Exception(19 ,   errMsg ? errMsg : constants.MESSAGES.prenuptialAgreement, err );
    },
    bankruptcyProvisions : function (errMsg , err) {
        return new Exception(20 ,   errMsg ? errMsg : constants.MESSAGES.bankruptcyProvisions, err );
    },
    separationOfDeFacto : function (errMsg , err) {
        return new Exception(21 ,   errMsg ? errMsg : constants.MESSAGES.separationOfDeFacto, err );
    },
    dateOfCohabitation : function (errMsg , err) {
        return new Exception(22 ,   errMsg ? errMsg : constants.MESSAGES.dateOfCohabitation, err );
    },
    timeSinceDivorce : function (errMsg , err) {
        return new Exception(23 ,   errMsg ? errMsg : constants.MESSAGES.timeSinceDivorce, err );
    },
    nonAusis : function (errMsg , err) {
        return new Exception(24 ,   errMsg ? errMsg : constants.MESSAGES.nonAusis, err );
    },
    cntRestPassword : function (errMsg , err) {
        return new Exception(25 ,   errMsg ? errMsg : constants.MESSAGES.cntRestPassword, err );
    },
    caseAlreadyCreated : function (errMsg , err) {
        return new Exception(26 ,   errMsg ? errMsg : constants.MESSAGES.caseAlreadyCreated, err );
    },
    resetTokenIsInvalid : function (errMsg , err) {
        return new Exception(27 ,   errMsg ? errMsg : constants.MESSAGES.resetTokenIsInvalid, err );
    },
    reqiredFieldMissing : function (errMsg , err) {
        return new Exception(28 ,   errMsg ? errMsg : constants.MESSAGES.reqiredFieldMissing, err );
    },
    notSuccessFullQualification : function (errMsg , err) {
        return new Exception(28 ,   errMsg ? errMsg : constants.MESSAGES.notSuccessFullQualification, err );
    }
};

//========================== Export Module End ===========================
