/**
 * Created by madhukar on 1/6/17.
 */

//========================== Load Modules Start =======================
//========================== Load internal modules ====================
const _ = require('lodash') ,
    usrRoutr = require("express").Router(),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    usrFacade = require('../facade/userFacade'),
    constants = require("../constants");



/**
 *  Api for user registration
 */
usrRoutr.route('/register')
    .post([ middleware.validators.validateUserRegistration] ,
        function (req, res) {
            var userData = _.pick(req.body, ['email', 'password']);
            userData.role = constants.ROLES.CLIENT;
            usrFacade.registerUser(userData)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result , constants.MESSAGES.registerUserMsg);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

usrRoutr.route('/resend/verification/link')
    .post([ middleware.validators.validateResendEmailVerification] ,
        function (req, res) {
            var email = req.body.email;
            usrFacade.resendVerificationLink(email)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * Email Verification API
 */
usrRoutr.route('/email/verify')
    .get(
        function (req, res) {
            let token = req.query.token;
            usrFacade.verifyEmail(token)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result ,constants.MESSAGES.emailVerified);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * Api for user Login
 */
usrRoutr.route('/login')
    .post([ middleware.validators.validateUserLogin],
        function (req, res) {
            var loginData = _.pick(req.body, ['email', 'password']);
            usrFacade.login(loginData)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });



/**
 * Api for user logout
 */
usrRoutr.route('/logout')
    .post([middleware.authentication.autntctTkn],
        function (req, res) {
            var loggedInUser = req.user.id;
            usrFacade.logout(loggedInUser)
                .then(function (result) {
                    resHndlr.sendSuccess(res, {} , "User logout Successfully.");
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


/**
 * Forget password
 */
usrRoutr.route('/password/forgot')
    .post([ middleware.validators.validateForgotPassword],
        function (req, res) {
            var userData = _.pick(req.body, ['email']);
            usrFacade.forgotPassword(userData)
                .then(function (result) {
                    resHndlr.sendSuccess(res,result , constants.MESSAGES.forgotPasswordLinkSend);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });
/**
 * Reset password
 */

usrRoutr.route('/password/reset')
    .post([middleware.validators.validateRestPwdToken],
        function (req, res) {

            var resetPasswordToken = req.body.resetPasswordToken;
            console.log("resetPasswordToken:"+ resetPasswordToken)
            /**
             * To Do need to apply validation
             * @type {*}
             */
            var password = req.body.password
            // var encPwd = sha256(password);
            // console.log("encPwd :" + encPwd)
            usrFacade.resetPassword(resetPasswordToken , password)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * Password Change
 *
 */

usrRoutr.route('/qualifying/error')
    .get([middleware.authentication.autntctTkn ],
        function (req, res) {
            var userId = req.user.id;
            usrFacade.getQualifyingError(userId)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });



        });

usrRoutr.route('/tnc/accept')
    .post([middleware.authentication.autntctTkn],
        function (req, res) {
            var userId = req.user.id;
            /**
             * To Do need to apply validation
             * @type {*}
             */
            usrFacade.tncAccept(userId )
                .then(function (result) {
                    resHndlr.sendSuccess(res, result ,constants.MESSAGES.tncAccepted);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


/**
 * Password Change
 *
 */

usrRoutr.route('/dashboard')
    .get([middleware.authentication.autntctTkn ],
        function (req, res) {
            var userId = req.user.id;
            usrFacade.getDashborad(userId)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result ,constants.MESSAGES.changedPassword);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * Password Change
 *
 */

usrRoutr.route('/brief')
    .get([/*middleware.authentication.autntctTkn */],
        function (req, res) {
            //var userId = req.user.id;
            var userId = 1;
            usrFacade.getBrief(userId)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result ,constants.MESSAGES.changedPassword);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

usrRoutr.route('/generate/pdf')
    .get([
        /*    middleware.authentication.autntctTkn,
         middleware.authorization.generateReport(["admin", "su", "manager"]),
         middleware.validators.generateReportPdf,*/
    ], function (req, res) {


    usrFacade.generateBriefPdf()
            .then(function (pdfStream) {
                console.log(pdfStream)
                if (!pdfStream)
                    return resHndlr.sendSuccess(null);

                let name = 'Custom report';
                name = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';

                res.writeHead(200, {
                    'Content-type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=' + name
                });

                pdfStream.pipe(res);
            })
            .catch(function (err) {

                resHndlr.sendError(res, err);
            });
    });

module.exports = usrRoutr