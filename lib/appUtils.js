"use strict";

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

const _ = require('lodash');

//========================== Load Internal Module =========================

const appConstants = require('./constants');

//========================== Load Modules End =============================


//========================== Export Module Start ===========================


/**
 * return user home
 * @returns {*}
 */
function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function getNodeEnv() {
    return process.env.NODE_ENV;
}

function getWebUrl() {
    /**
     * TODO need to be fixed , set based on envoirement
     */
    return "localhost:3011/";
}

function isProdEnv() {
    let env = getNodeEnv();
    return _.includes(["prod", "production"], env);
}

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return new RegExp(pattern).test(email);
}

/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
function createHashSHA256(pass) {
    return sha256(pass);
}

/**
 * returns random number for password
 * @returns {string}
 */
let getRandomPassword = function () {
    return getSHA256(Math.floor((Math.random() * 1000000000000) + 1));
};

let getSHA256 = function (val) {
    return sha256(val + "password");
};





function setHeadersForCrossDomainIssues(res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization, x-custom-token , X-XSRF-TOKEN");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    return res;
}


    function getEmailVerificationLink(token) {
        return getWebUrl() + `verify/${token}`;
    }

function ForgotPasswordLink(token) {
    return getWebUrl() + `reset/${token}`;
}

function getSortSkipLimitParams({pageNo = 1, pageSize = 10, sortOrder = 1, sortBy}) {
    let sortSkipLimit = {};
    if (pageSize === "all") {
        console.log("return all listing");
    } else {
        sortSkipLimit.skip = (pageNo - 1) * pageSize;
        // to convert string to int
        sortSkipLimit.limit = 1 * pageSize;
    }
    if (sortBy) {
        sortSkipLimit.sort = {[sortBy]: sortOrder == 1 ? -1 : 1};
    }
    return sortSkipLimit;
}


/*
 @ calculate the milliseconds
 */
function currentUnixTimeStamp(params) {
    if(params){
        return Math.floor(new Date(params) / 1000);
    }
    return Math.floor(Date.now() / 1000);
}

const absoluteUrl = "http://localhost:3000/"


//========================== Export Module Start ===========================

module.exports = {
    getNodeEnv ,
    setHeadersForCrossDomainIssues,
    isValidEmail,
    getEmailVerificationLink ,
    ForgotPasswordLink,
    getSortSkipLimitParams,
    currentUnixTimeStamp
};

//========================== Export Module End===========================

//===========================DB Utility==================================

