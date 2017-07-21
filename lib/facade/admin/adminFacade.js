/**
 * Created by madhukar on 15/6/17.
 */
"use strict";

//========================== Load Modules Start =======================
const _ = require("lodash"),
    appUtils = require('../../appUtils'),
    appConstants = require('../../constants');

//========================== Load internal modules ====================
// Load user service
const adminService = require('../../services/admin/adminService'),
    exceptions = require('../../customExceptions'),
    jwtHandler = require('../../jwtHandler'),
    userService = require('../../services/userService'),
    emailService = require('../../services/emailService')
//========================== Load Modules End ==============================================

/**
 * login admin/suadmin
 * @param loginData
 * @returns {*}
 */
function adminLogin(loginData){
    //check for user email
    var email = loginData.email
    var password = loginData.password
    var query = "select id , password , role , status from users where email=$1";
    var parameter = [email];
    return userService.getUserByQuery(query , parameter)
        .then(function (data) {
            if (data ) {
                if (!(password == data['password'])) {
                        throw exceptions.wrongCredentials(appConstants.MESSAGES.wrongPassword)
                } else {
                    if(data.role == appConstants.ROLES.ADMIN || data.role == appConstants.ROLES.SUPERADMIN){
                        if(data.status == appConstants.STATUS.UNVERIFIED){
                            // not verified
                            throw exceptions.emailNotVerified(appConstants.MESSAGES.emailNotVerified)
                        }else{
                            var userData = {id:data['id'] , email: email , role : data.role};
                            return jwtHandler.genJWTToken(userData)
                        }
                    }else{
                        throw exceptions.notAdmin(appConstants.MESSAGES.NotAdmin)
                    }

                }
            } else {
                throw exceptions.actNotRecognised(appConstants.MESSAGES.actNotRecognised())
            }

        })
        .then(function (accessToken) {
            var updateQuery = "update users SET accesstoken = $1 where email=$2 returning id";
            var updateParam = [accessToken ,  email];
            return userService.updateUser(updateQuery , updateParam);
        })
        .then(function(updateData){
            var query = "select * from users where email = $1;"
            var paramData = [email];
            return userService.getUserByQuery(query , paramData);
        })
        .catch(function (err) {
            throw exceptions.someThingWrong()
        })
}

function createAdmin(admindata) {
    if(admindata.key != 89){
        throw exceptions.validationError("Invalid key")
    }
    var status = appConstants.STATUS.ACTIVE
    var role = appConstants.ROLES.SUPERADMIN
    var createdat = appUtils.currentUnixTimeStamp();
    var updatedat = new Date();
    var email = admindata.email;
    var password = admindata.password
    var insertQuery = "insert into users( email,password ,role , createdat,updatedat,status , isemailverified) values($1,$2,$3,$4 , $5 , $6 ,$7  ) returning id";
    var parm = [email ,password, role, createdat, updatedat ,status , true];
    return userService.getUserByQuery(insertQuery , parm)
    then(function (data) {
        return data;
    })

}

/**
 * for adding admin
 * @param adminData
 * @returns {Request}
 */
function addAdmin(adminData) {
    var fName = adminData.fName;
    var lName = adminData.lName;
    var email = adminData.email;
    var type = parseInt(adminData.type);
    var query = "select count(*)  from users where email = $1";
    var parameter = [email];
    var createdat = appUtils.currentUnixTimeStamp();
    var updatedat = new Date();
    return userService.getUserByQuery(query , parameter)
        .then(function (data) {
            if(data.count > 0){
              throw exceptions.userAlreadyAdded(appConstants.MESSAGES.userAlreadyAdded);
            }else{
                var status = appConstants.STATUS.UNVERIFIED
                var insertQuery = "insert into users(fname , lname , email,role , createdat,updatedat,status , isemailverified) values($1,$2,$3,$4 , $5 , $6 , $7 , $8) returning id";
                var parm = [fName ,lName, email, type, createdat, updatedat ,status , false];
                return userService.addNewUser(insertQuery , parm)
            }
        })
        .then(function (result) {
                var userData = {id: result.id, email: email, role : type};
                return jwtHandler.genJWTToken(userData)
        })
        .then(function (token) {
            var resetpasswordtoken = token;
            var updateQuery = "update users SET resetpasswordtoken = $1  where email=$2 returning id";
            var updateParam = [resetpasswordtoken , email];
            //Send verification mail
            emailService.sendPasswordSetEmail(resetpasswordtoken , email)
            return userService.updateUser(updateQuery , updateParam);
        })
        .then(function(updateData){
            var query = "select * from users where email = $1;"
            var paramData = [email];
            return userService.getUserByQuery(query , paramData);
        })
}

/**
 * Verify admin and  set password
 * @param setPasswordToken
 * @param password
 * @returns {Promise|Promise.<T>}
 */
function setAdminpassword(setPasswordToken , password) {
    var id ;
    var query = "select id , email , role , status from users where resetpasswordtoken = $1"
    var param = [setPasswordToken]
    return userService.getUserByQuery(query , param)
        .then(function (user) {
            if(user){
                if(user.status == appConstants.STATUS.ACTIVE){
                    throw exceptions.passwordAlreadySet(appConstants.MESSAGES.passwordAlreadySet)
                }else{
                    id = user.id;
                    var userData = {id: user.id, email: user.email, role : user.role};
                    return jwtHandler.genJWTToken(userData)
                }

            }else{
                throw exceptions.actNotRecognised();
            }
        })
        .then(function (token) {
            var updateQuery  = "UPDATE users SET password = $1 , accessToken = $2 , resetpasswordtoken = $3 ,status = $4 where id = $5 returning id";
            var data = ''
            var param = [password ,token ,data,  appConstants.STATUS.ACTIVE , id ]
            return userService.updateUser(updateQuery ,  param);
        })
        .then(function(updateData){
            var query = "select * from users where id = $1;"
            var paramData = [id];
            return userService.getUserByQuery(query , paramData);
        })
        .catch(function (err) {
            throw exceptions.actNotRecognised(appConstants.MESSAGES.actNotRecognised);
        })
}

/**
 * Logout user
 * @param id
 * @returns {*}
 */
function logout(id) {
    var updateQuery = "update users SET accesstoken = $1 where id=$2 returning id";
    var updateParam = ["" ,  id];
    return userService.updateUser(updateQuery ,updateParam);
}


/**
 * for forgot password
 * @param userData
 * @returns {Request}
 */
function forgotPassword(userData) {
    var email = userData.email;
    var query = "select id , email , role from users where email = $1";
    var param = [email]
    return userService.getUserByQuery(query , param)
        .then(function (user) {
            if(user){
                if(user.status == appConstants.STATUS.ACTIVE ||user.status == appConstants.STATUS.SUSPENDED){
                    throw exceptions.cntRestPassword(appConstants.MESSAGES.cntRestPassword );
                }else{
                    var tokenData ={id: user.id, email: user.email , role : user.role };
                    return jwtHandler.genJWTToken(userData)
                }
            }else{
                throw exceptions.noUserFoundForForgot(appConstants.MESSAGES.noUserFoundForForgot );
            }
        })
        .then(function(resetPasswordToken){
            var query = "update users SET resetpasswordtoken = $1 where email = $2 returning id";
            var param = [resetPasswordToken , email];
            emailService.sendForgotPasswordLink(resetPasswordToken , email);
            return userService.updateUser(query , param);
        })
        .then(function(updateData){
            var query = "select * from users where email = $1;"
            var paramData = [email];
            return userService.getUserByQuery(query , paramData);
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
function resetPassword(resetPasswordToken , password) {
    var id ;
    var query = "select id from users where resetpasswordtoken = $1"
    var param = [resetPasswordToken]
    return userService.getUserByQuery(query , param)
        .then(function (user) {
            if(user){
                var updateQuery  = "UPDATE users SET password = $1 , resetpasswordtoken = $2  where id = $3 returning id";
                var data = ''
                var param = [password ,data,  user.id  ]
                id = user.id;
                return userService.updateUser(updateQuery ,  param);
            }else{
                throw exceptions.actNotRecognised();
            }
        })
        .then(function(updateData){
            var query = "select * from users where id = $1;"
            var paramData = [id];
            return userService.getUserByQuery(query , paramData);
        })
        .catch(function (err) {
            throw exceptions.actNotRecognised();
        })
}

module.exports = {
    adminLogin,
    addAdmin,
    setAdminpassword,
    createAdmin,
    logout,
    forgotPassword,
    resetPassword
}
