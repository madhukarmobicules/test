//========================== Load Modules Start ===========================

//========================== Load external Module =========================

const _ = require("lodash");

//========================== Load Internal Module =========================

const appUtils = require("../appUtils");
const appConst = require("../constants");
const exceptions = require("../customExceptions");

//========================== Load Modules End =============================
/**
 * For register user validation
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateUserRegistration(req , res , next) {

    let {email, password } = _.pick(req.body, ['email', 'password']);

    if (_.isEmpty(email) || _.isEmpty(password)) {
        return next(exceptions.validationError(appConst.MESSAGES.requiredField));
    }
    // validate email
    if (!appUtils.isValidEmail(email)) {
        return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
    }
    next();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateResendEmailVerification(req , res , next) {
    let {email } = _.pick(req.body, ['email']);

    if (_.isEmpty(email)) {
        return next(exceptions.validationError(appConst.MESSAGES.requiredField));
    }
    // validate email
    if (!appUtils.isValidEmail(email)) {
        return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
    }
    next();
}

/**
 * For validating login user
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateUserLogin(req , res , next) {
    let {email, password } = _.pick(req.body, ['email', 'password']);

    if (_.isEmpty(email) || _.isEmpty(password)) {
        return next(exceptions.validationError());
    }
    next();
}



/**
 * Validate forgot password
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function validateForgotPassword(req , res  , next) {
    let {email } = _.pick(req.body, ['email']);

    if (_.isEmpty(email)) {
        return next(exceptions.validationError());
    }
    next();
}

/**
 * Validate password changes
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function passwordChangeValidation(req , res , next) {
    let {cPassword , nPassword } = _.pick(req.body, ['cPassword' ,'nPassword']);

    if (_.isEmpty(cPassword) || _.isEmpty(nPassword)) {
        return next(exceptions.validationError());
    }
    next();
}

/**
 * Validate reset password token
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateRestPwdToken(req , res , next) {
    var resetPasswordToken = req.body.resetPasswordToken;
    if (_.isEmpty(resetPasswordToken)) {
        return next(exceptions.validationError());
    }
    next();
}

/**
 * Admin validation
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */

function validateAdminLogin(req, res , next){
    let {email, password } = _.pick(req.body, ['email', 'password']);

    if (_.isEmpty(email) || _.isEmpty(password)) {
        return next(exceptions.validationError());
    }
    next();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateAdminAdd(req, res , next) {
    let {fName , lName , type , email } = _.pick(req.body, ['fName' , 'lName' , 'type' , 'email']);
    if (_.isEmpty(fName) || _.isEmpty(lName) ,_.isEmpty(type) || _.isEmpty(email)) {
        return next(exceptions.validationError());
    }
    // validate email
    if (!appUtils.isValidEmail(email)) {
        return next(exceptions.validationError(appConst.MESSAGES.invalidEmail));
    }

    if(!(type == appConst.ROLES.ADMIN || type == appConst.ROLES.SUPERADMIN)){
        return next(exceptions.validationError(appConst.MESSAGES.shouldBeAdminOrSU));
    }
    next();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateAdminSetPassword(req, res , next) {
    let {setPasswordToken , password  } = _.pick(req.body, ['setPasswordToken' , 'password']);
    if (_.isEmpty(setPasswordToken) || _.isEmpty(password) ) {
        return next(exceptions.validationError());
    }
    next()
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function validateQualifyingQuestionAnswer(req , res , next) {
    var qualifyingAnswer = req.body.qualifyingAnswer;
    _.each(qualifyingAnswer , function (answer) {
        if(!answer.qid || !answer.answer || !answer.atype){
           throw exceptions.validationError("submitted json is not in valid format")
        }
    })
    next();
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function validateQuestionAnswer(req , res , next) {
    var answer = req.body.answer;
    var qid = req.body.qid;
    var atype = req.body.atype;

        if(!qid ){
            throw exceptions.validationError("submitted json is not in valid format")
        }
    next();
}

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function validateImportCsv(req , res , next) {
    var key = req.body.key;
    if (_.isEmpty(key)  ) {
        return next(exceptions.validationError());
    }
    if (key != 89  ) {
        return next(exceptions.validationError());
    }
    next()
}


function validateAllQuestion(req, res , next) {
    var sid = req.query.sid;
    //var rank = req.query.rank;
    if(sid){
        if(parseInt(sid) <= 2){
            return next(exceptions.validationError("sid should be greator than 2"));
        }
    }
    /*if(rank){
        if(parseInt(rank) <= 2){
            return next(exceptions.validationError("ran should be greator than 2"));
        }
    }*/
    next()
}
//========================== Export Module Start ===========================

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateForgotPassword ,
    passwordChangeValidation,
    validateRestPwdToken,
    validateResendEmailVerification,

    // Admin validation
    validateAdminLogin,
    validateAdminSetPassword,
    validateAdminAdd,

    //valiodation for question
    validateQualifyingQuestionAnswer,
    validateImportCsv ,
    validateQuestionAnswer ,
    validateAllQuestion

};

//========================== Export module end ==================================
