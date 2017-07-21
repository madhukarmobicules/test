/**
 * Created by madhukar on 23/6/17.
 */

"use strict";

//========================== Load Modules Start =======================
const _ = require("lodash"),
    appUtils = require('../appUtils'),
    appConstants = require('../constants');

//========================== Load internal modules ====================
// Load user service
const questionService = require('../services/questionService'),
    exceptions = require('../customExceptions'),
    baseDao = require('../dao/baseDao'),
    sectionService = require('../services/sectionService')
//========================== Load Modules End ==============================================

/**
 * import question into db
 */
function importSections(data) {
    var count = 0;
    _.each(data , function(qData){
        count = count + 1;
        console.log("count:"+ count)
        var section = qData.data;
        var sLength = section.length;
        for (var i = 1; i <= sLength - 1; i++) {
            var sid = section[i][0]; //
            var sname = section[i][1];
            var srank = section[i][2];
            var createdat = appUtils.currentUnixTimeStamp();
            var updatedat = new Date();
            if (sid == "null") {
                throw exceptions.validationError("Section id  can not be null or empty.")
            }
            if (sname == "null") {
                throw exceptions.validationError("Section name  can not be null or empty.")
            }
            if (srank == "null") {
                throw exceptions.validationError("Section rank  can not be null or empty.")
            }
            var parm = [sid, sname, srank , createdat , updatedat]

            var insertQuery = "insert into section(sid,sname,srank , createdat , updatedat) values($1,$2,$3 ,$4,$5) returning sid";
            sectionService.addSection(insertQuery, parm)
        }

    })
}

function deleteAllSectioions() {
    var query = "truncate table section";
    var param = []
    sectionService.executeQuery(query, param)
    return "success";
}



module.exports = {
    importSections,
    deleteAllSectioions

}