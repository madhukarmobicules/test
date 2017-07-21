/**
 * Created by madhukar on 30/6/17.
 */
//========================== Load Modules Start =======================
const _ = require("lodash"),
    appUtils = require('../../appUtils'),
    appConstants = require('../../constants');

//========================== Load internal modules ====================
const sectionTestService = require('../../services/test/sectionTestService'),
    exceptions = require('../../customExceptions');
//========================== Load Modules End ==============================================

/**
 * Truncate section_test tables
 */
function deleteSectionTestTable() {
    var query = "truncate table section_test ";
    var param = []
    sectionTestService.truncateTables(query ,param)
}

/**
 *
 * @param query
 * @param param
 * @returns {*}
 */
function executeQuery(query , param) {
    return sectionTestService.executeQuery(query , param)
}

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
            var parm = [sid, sname, srank , createdat , updatedat]
            var insertQuery = "insert into section_test(sid,sname,srank , createdat , updatedat) values($1,$2,$3 ,$4,$5) returning sid";
            sectionTestService.addSection(insertQuery, parm)

        }

    })
    return 1;
}

module.exports = {
    deleteSectionTestTable,
    executeQuery,
    importSections
}
