/**
 * Created by madhukar on 8/6/17.
 */


//========================== Load Modules Start =======================
//========================== Load internal modules ====================
const _ = require('lodash') ,
    questionRoutes = require("express").Router(),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    questionFacade = require('../facade/questionFacade'),
    constants = require("../constants"),
    envConfig = require("../config/index");

var xlsx = require("node-xlsx");

var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');



/**
 * TODO
 *
 * Api for import question
 */
questionRoutes.route('/import')
    .post([/*middleware.authorization.isSuperAdmin ,*/  middleware.validators.validateImportCsv] ,
        function (req, res) {
            /**
             * For security purpose
             * need to be removed
             * @type {string}
             */
            var csvfile = envConfig.env.projectURL + "/final.xlsx"
            const workSheetsFromFile = xlsx.parse(csvfile)
            questionFacade.importQuestion(workSheetsFromFile)
                //.then(function (result) {
                    resHndlr.sendSuccess(res, {} ,"Successfully uploaded the questions.");
               /* })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });*/
        });



questionRoutes.route('/dq/import')
    .post([/*middleware.authorization.isSuperAdmin ,*/ /* middleware.validators.validateImportCsv*/] ,
        function (req, res) {
            /**
             * For security purpose
             * need to be removed
             * @type {string}
             */
            var csvfile = envConfig.env.projectURL + "/dquestion.xlsx"
            const workSheetsFromFile = xlsx.parse(csvfile)
            questionFacade.importdQuestion(workSheetsFromFile)
            //.then(function (result) {
            resHndlr.sendSuccess(res, {} ,"Successfully uploaded the sections.");
            /* })
             .catch(function (err) {
             resHndlr.sendError(res, err);
             });*/
        });
/**
 * TODO
 *
 * Api for truncating  question
 */
questionRoutes.route('/truncate')
    .post([/*middleware.authorization.isSuperAdmin ,*/  middleware.validators.validateImportCsv] ,
        function (req, res) {
            // Parse a file
            questionFacade.deleteAllQuestions()
                //.then(function (result) {
                    resHndlr.sendSuccess(res, {} ,"Successfully removed the csv");
               /* })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });*/
        });



/**
 * TODO
 *
 * Api for get qualifying question
 */
questionRoutes.route('/qualifying')
    .get([middleware.authentication.autntctTkn /*, middleware.authorization.isClient*/],
        function (req, res) {
            // Parse a file
            var uid = req.user.id
            questionFacade.getAllQualifyingQuestions(uid)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


/**
 * TODO
 *
 * Api for qualifying question answer
 */
questionRoutes.route('/qualifying/answer')
    .post([middleware.authentication.autntctTkn ,  middleware.validators.validateQualifyingQuestionAnswer] ,
        function (req, res) {
            // Parse a file
            var uid = req.user.id;
            var qualifyingAnswer = req.body.qualifyingAnswer ;
            console.log("qualifyingAnswer:"+ qualifyingAnswer)
            questionFacade.processResponse(qualifyingAnswer ,uid)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * TODO
 *
 * Api for import question
 */
questionRoutes.route('/answer')
    .post([middleware.authentication.autntctTkn ,  middleware.validators.validateQuestionAnswer] ,
        function (req, res) {
            // Parse a file
            let uid = req.user.id;
            let data = req.body
            questionFacade.processAnswer(data , uid)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

/**
 * TODO
 *
 * Api for get qualifying question
 */
questionRoutes.route('/get/all')
    .get([middleware.authentication.autntctTkn , middleware.authorization.isClient , middleware.validators.validateAllQuestion],
        function (req, res) {
            // Parse a file
            var uid= req.user.id;
            var sid= req.query.sid;
            //var rank= req.query.rank;
            var pageNo= req.query.pageNo;
            var pageSize= req.query.pageSize;
            questionFacade.getAllQuestions(uid , sid  , pageNo , pageSize)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });

module.exports = questionRoutes
