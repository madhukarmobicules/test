/**
 * Created by madhukar on 15/6/17.
 */

//========================== Load Modules Start =======================
//========================== Load internal modules ====================
const _ = require('lodash') ,
    adminRoutes = require("express").Router(),
    resHndlr = require('../../resHandler'),
    middleware = require("../../middleware"),
    adminFacade = require('../../facade/admin/adminFacade'),
    constants = require("../../constants");


/**
 * Admin login
 */
adminRoutes.route('/login')
    .post([ middleware.validators.validateAdminLogin],
        function (req, res) {
            var loginData = _.pick(req.body, ['email', 'password']);
            adminFacade.adminLogin(loginData)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


/**
 * Admin login
 */
adminRoutes.route('/create')
    .post([ middleware.validators.validateAdminLogin],
        function (req, res) {
            var loginData = _.pick(req.body, ['email', 'password','key']);
            adminFacade.createAdmin(loginData)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * add admin
 */
adminRoutes.route('/add')
    .post([ middleware.validators.validateAdminAdd , middleware.authorization.isSuperAdmin],
        function (req, res) {
            var addAdminData = _.pick(req.body, ['fName', 'lName' ,'email' ,'type']);
            adminFacade.addAdmin(addAdminData)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * Set admin password
 */
adminRoutes.route('/set/password')
    .post([ middleware.validators.validateAdminSetPassword],
        function (req, res) {
    var setPasswordToken = req.body.setPasswordToken;
    var password = req.body.password ;
            adminFacade.setAdminpassword(setPasswordToken , password)
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
adminRoutes.route('/logout')
    .post([middleware.authentication.autntctTkn],
        function (req, res) {
            var loggedInUser = req.user.id;
            adminFacade.logout(loggedInUser)
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
adminRoutes.route('/password/forgot')
    .post([ middleware.validators.validateForgotPassword],
        function (req, res) {
            var userData = _.pick(req.body, ['email']);
            adminFacade.forgotPassword(userData)
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

adminRoutes.route('/password/reset')
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
            adminFacade.resetPassword(resetPasswordToken , password)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


module.exports = adminRoutes

