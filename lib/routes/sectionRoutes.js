/**
 * Created by madhukar on 23/6/17.
 */

//========================== Load Modules Start =======================
//========================== Load internal modules ====================
const _ = require('lodash') ,
    sectionRoutes = require("express").Router(),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    sectionFacade = require('../facade/sectionFacade'),
    constants = require("../constants"),
    envConfig = require("../config/index");

var xlsx = require("node-xlsx");

var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

/**
 * Import sections
 */
sectionRoutes.route('/import')
    .post([/*middleware.authorization.isSuperAdmin ,*/  middleware.validators.validateImportCsv] ,
        function (req, res) {
            /**
             * For security purpose
             * need to be removed
             * @type {string}
             */
            var csvfile = envConfig.env.projectURL + "/section.xlsx"
            const workSheetsFromFile = xlsx.parse(csvfile)
            sectionFacade.importSections(workSheetsFromFile)
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
 * Api for truncating  section
 */
sectionRoutes.route('/truncate')
    .post([/*middleware.authorization.isSuperAdmin ,*/  middleware.validators.validateImportCsv] ,
        function (req, res) {
            // Parse a file
            sectionFacade.deleteAllSectioions()
            //.then(function (result) {
            resHndlr.sendSuccess(res, {} ,"Successfully removed the sections.");
            /* })
             .catch(function (err) {
             resHndlr.sendError(res, err);
             });*/
        });




module.exports = sectionRoutes

