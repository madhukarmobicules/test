/**
 * Created by madhukar on 27/6/17.
 */
//========================== Load Modules Start =======================
//========================== Load internal modules ====================
const _ = require('lodash') ,
    caseRoutes = require("express").Router(),
    resHndlr = require('../resHandler'),
    middleware = require("../middleware"),
    caseFacade = require('../facade/caseFacade'),
    constants = require("../constants"),
    envConfig = require("../config/index");

/**
 * TODO
 *
 * Api for creating case
 */
caseRoutes.route('/create')
    .post([middleware.authentication.autntctTkn],
        function (req, res) {
            // Parse a file
            var uid = req.user.id;
            caseFacade.createCase(uid)
                .then(function (result) {
                    resHndlr.sendSuccess(res, result);
                })
                .catch(function (err) {
                    resHndlr.sendError(res, err);
                });
        });


module.exports = caseRoutes
