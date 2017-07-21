/**
 * Created by madhukar on 8/6/17.
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
    answerService = require('../services/answerService'),
    sectionService = require('../services/sectionService'),
    userService = require('../services/userService'),
    emailService = require('../services/emailService')
//========================== Load Modules End ==============================================

/**
 * import question into db
 */
function importQuestion(data) {
    var count = 0;
    _.each(data, function (qData) {
        count = count + 1;
        console.log("count:" + count)
        var qualifyingQuestion = qData.data;
        var qLength = qualifyingQuestion.length;
        for (var i = 1; i <= qLength - 1; i++) {
            var section = qualifyingQuestion[i][0]; // section for qualifying question
            var rparty = qualifyingQuestion[i][1];
            var levelname = qualifyingQuestion[i][2];
            var qid = qualifyingQuestion[i][3];

            var haschild = qualifyingQuestion[i][4];
            var sorder = qualifyingQuestion[i][6];
            var ismandatory = qualifyingQuestion[i][7];
            var qdescription = qualifyingQuestion[i][9];

            var checklist = qualifyingQuestion[i][10];
            var lforbrief = qualifyingQuestion[i][11];
            var datatype = qualifyingQuestion[i][12];
            var dd1 = qualifyingQuestion[i][14];
            var dd2 = qualifyingQuestion[i][15];
            var dd3 = qualifyingQuestion[i][16];
            var dd4 = qualifyingQuestion[i][17];
            var dd5 = qualifyingQuestion[i][18];
            var dd6 = qualifyingQuestion[i][19];
            var dd7 = qualifyingQuestion[i][20];
            var dd8 = qualifyingQuestion[i][21];
            var dd1logic = qualifyingQuestion[i][22];
            var dd2logic = qualifyingQuestion[i][23];
            var dd3logic = qualifyingQuestion[i][24];
            var dd4logic = qualifyingQuestion[i][25];
            var dd5logic = qualifyingQuestion[i][26];
            var dd6logic = qualifyingQuestion[i][27];
            var dd7logic = qualifyingQuestion[i][28];
            var dd8logic = qualifyingQuestion[i][29];
            var sno = qualifyingQuestion[i][30];
            var dquestion = qualifyingQuestion[i][32];
            var dqarrayNew = qualifyingQuestion[i][33];
            var childarry = []
            var radioArray = []
            var dqarray = [];
            if (dqarrayNew != null) {
                dqarray = dqarrayNew;
            }
            if (haschild) {
                if (qualifyingQuestion[i][14] != null) {
                    var obj = {"key": qualifyingQuestion[i][14], "value": qualifyingQuestion[i][22]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][15] != null) {
                    var obj = {"key": qualifyingQuestion[i][15], "value": qualifyingQuestion[i][23]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][16] != null) {
                    var obj = {"key": qualifyingQuestion[i][16], "value": qualifyingQuestion[i][24]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][17] != null) {
                    var obj = {"key": qualifyingQuestion[i][17], "value": qualifyingQuestion[i][25]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][18] != null) {
                    var obj = {"key": qualifyingQuestion[i][18], "value": qualifyingQuestion[i][26]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][19] != null) {
                    var obj = {"key": qualifyingQuestion[i][19], "value": qualifyingQuestion[i][27]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][20] != null) {
                    var obj = {"key": qualifyingQuestion[i][20], "value": qualifyingQuestion[i][28]}
                    childarry.push(obj);
                }
                if (qualifyingQuestion[i][21] != null) {
                    var obj = {"key": qualifyingQuestion[i][21], "value": qualifyingQuestion[i][29]}
                    childarry.push(obj);
                }
            } else {
                if (datatype == "list") {
                    if (qualifyingQuestion[i][14] != null) {
                        var obj = {"key": qualifyingQuestion[i][14], "value": qualifyingQuestion[i][22]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][15] != null) {
                        var obj = {"key": qualifyingQuestion[i][15], "value": qualifyingQuestion[i][23]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][16] != null) {
                        var obj = {"key": qualifyingQuestion[i][16], "value": qualifyingQuestion[i][24]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][17] != null) {
                        var obj = {"key": qualifyingQuestion[i][17], "value": qualifyingQuestion[i][25]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][18] != null) {
                        var obj = {"key": qualifyingQuestion[i][18], "value": qualifyingQuestion[i][26]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][19] != null) {
                        var obj = {"key": qualifyingQuestion[i][19], "value": qualifyingQuestion[i][27]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][20] != null) {
                        var obj = {"key": qualifyingQuestion[i][20], "value": qualifyingQuestion[i][28]}
                        radioArray.push(obj);
                    }
                    if (qualifyingQuestion[i][21] != null) {
                        var obj = {"key": qualifyingQuestion[i][21], "value": qualifyingQuestion[i][29]}
                        radioArray.push(obj);
                    }
                }
            }
            var childerns = {"childs": childarry}
            var radios = {"childs": radioArray}
            var insertQuery = "insert into question(section,rparty,levelname,qid,haschild , sorder ,ismandatory ,qdescription ," +
                "checklist ,lforbrief , datatype ,dd1 ,dd2 , dd3 , dd4 , dd5 , dd6 , dd7 , dd8 ,dd1logic , dd2logic , dd3logic,dd4logic , dd5logic ,dd6logic ," +
                "dd7logic , dd8logic ,  childerns , sno , radios , dquestion , dqarray) values($1,$2,$3,$4 , $5 , $6, $7 , $8,$9 ,$10 ,$11 ,$12 ,$13,$14,$15,$16 , $17 , $18, $19 , $20,$21 ,$22 ,$23 ,$24 , $25 , $26 , $27 , $28 ,$29 ,$30 ,$31 , $32) returning qid";

            if (section == "null") {
                throw exceptions.validationError("Project Flow - Section can not be null or empty.")
            }
            var rArray = ['You', 'Your partner', 'Joint', 'Your partner']
            /* if (rparty == "null") {
             throw exceptions.validationError("Relevant Party can not be null or empty.")
             }*/
            console.log("rParty :" + rparty + "Qid:" + qid + "sorder : " + sorder)
            if (_.indexOf(rArray, rparty) < 0) {

                throw exceptions.validationError("Invalid Relevant Party .")
            }
            if (levelname == "null") {
                throw exceptions.validationError("Level 4 Name can not be null or empty.")
            }
            if (qid == "null") {
                throw exceptions.validationError("Question ID Name can not be null or empty.")
            }
            if (haschild == "null") {
                throw exceptions.validationError("haschild  can not be null or empty.")
            }
            if (qid == 449) {
                sorder = 1000;
            }
            if (sorder == "null") {
                console.log("hi :" + sorder)
                sorder = 1000;
            }
            if (ismandatory == "null") {
                throw exceptions.validationError("ismandatory  can not be null or empty.")
            }
            if (qdescription == "null") {
                throw exceptions.validationError("qdescription  can not be null or empty.")
            }
            if (checklist == "null") {
                checklist = ""
            }
            if (lforbrief == "null") {
                checklist = ""
            }
            if (datatype == "null") {
                throw exceptions.validationError("datatype  can not be null or empty.")
            }
            if (dd1 == "null") {
                dd1 = "";
            }
            if (dd2 == "null") {
                dd2 = "";
            }
            if (dd3 == "null") {
                dd3 = "";
            }
            if (dd4 == "null") {
                dd4 = "";
            }
            if (dd5 == "null") {
                dd5 = "";
            }
            if (dd6 == "null") {
                dd6 = "";
            }
            if (dd7 == "null") {
                dd7 = "";
            }
            if (dd8 == "null") {
                dd8 = "";
            }
            if (dd1logic == "null") {
                dd1logic = "";
            }
            if (dd2logic == "null") {
                dd2logic = "";
            }
            if (dd3logic == "null") {
                dd3logic = "";
            }
            if (dd4logic == "null") {
                dd4logic = "";
            }
            if (dd5logic == "null") {
                dd5logic = "";
            }
            if (dd6logic == "null") {
                dd6logic = "";
            }
            if (dd7logic == "null") {
                dd7logic = "";
            }
            if (dd8logic == "null") {
                dd8logic = "";
            }
            if (dd1 == "null") {
                dd1 = "";
            }
            if (childerns == "null") {
                childerns = ""
            }
            if (dquestion == "null" || dquestion == 'undefined') {
                dquestion = 0
            }
            /*if (dqarray == "null" || dqarray == 'undefined') {
             dqarray = []
             }*/
            if (sno == "null") {
                throw exceptions.validationError("sno cant not be null or empty.")
            }
            console.log("sorder:" + sorder)
            var parm = [section, rparty, levelname, qid, haschild, sorder, ismandatory, qdescription, checklist, lforbrief, datatype, dd1, dd2, dd3, dd4, dd5, dd6, dd7, dd8, dd1logic, dd2logic, dd3logic, dd4logic, dd5logic, dd6logic, dd7logic, dd8logic, childerns, sno, radios, dquestion, dqarray];
            // console.log("")
            questionService.addQuestion(insertQuery, parm)
        }

    })


}

/**
 * Delete all question
 * @returns {string}
 */
function deleteAllQuestions() {
    var query = "truncate table question";
    var param = []
    questionService.executeQuery(query, param)
    return "success";

}

/**
 * Get all qualifying question
 * @param uid
 * @returns {Promise.<TResult>|Request}
 */

function getAllQualifyingQuestions(uid) {
    // uid = 1;
    var qualifyingData = {}
    var readOnly = false;
    var uQuery = "select * from users where id = $1"
    var uParam = [uid];
    return userService.executeQuery(uQuery, uParam)
        .then(function (data) {
            if (data.status == appConstants.STATUS.QUALIFIED) {
                readOnly = true;
            }
            var query = "select q.id , q.qid , q.section ,  q.rparty , q.levelname , q.haschild , q.sorder , q.ismandatory , q.qdescription ,  q.checklist , q.lforbrief , q.datatype , q.childerns ,q.radios, q.sno , q.dquestion , q.dqarray , ua.answer, ua.roption  from (select * from question where sno = $1  ) q  LEFT JOIN (select * from user_answer where uid = $2) ua on   q.qid = ua.qid ORDER BY q.sorder"
            var param = [1, uid]
            return questionService.executeMultiQuery(query, param)
        })
        .then(function (page1) {
            qualifyingData.page1 = page1;
            var query = "select q.id , q.qid , q.section ,  q.rparty , q.levelname , q.haschild , q.sorder , q.ismandatory , q.qdescription ,  q.checklist , q.lforbrief , q.datatype , q.childerns ,q.radios, q.sno  ,q.dquestion , q.dqarray, ua.answer ,ua.roption from (select * from question where sno = $1   ) q  LEFT JOIN (select * from user_answer where uid = $2) ua on   q.qid = ua.qid  ORDER BY q.sorder"
            var param = [2, uid]
            return questionService.executeMultiQuery(query, param)
        })
        .then(function (page2) {
            qualifyingData.page2 = page2;
            qualifyingData.readOnly = readOnly;
            return qualifyingData;
        })

}

/**
 * Incomplete
 * Check for conflict of interest
 */

function processResponse(responseData, uid) {
    var qerror = [];
    var alert = false;
    var response = {};
    var qidData = _.map(responseData, "qid")
    var qMap = _.reduce(responseData, function (hash, value) {
        var key = value["qid"];
        hash[key] = value.answer;
        return hash;
    }, {});

    var errMap = [];
    // check for conflict of interest
    var caseOneCount = 0;
    var caseTwoCount = 0;
    var caseThreeCount = 0;
    var caseFourCount = 0;
    var query = "select count(id) from user_answer where qid = $1 and answer = $2";
    var param = [1, qMap[6]]
    return answerService.executeQuery(query, param)
        .then(function (data) {
            if (data && parseInt(data.count) > 0) {
                caseOneCount = parseInt(data.count);
            }

            var query = "select count(id) from user_answer where qid = $1 and answer = $2";
            var param = [16, qMap[17]]
        })
        .then(function (data) {
            if (data && parseInt(data.count) > 0) {
                caseTwoCount = parseInt(data.count);
            }
            var query = "select count(id) from user_answer where qid = $1 and answer = $2";
            var param = [2, qMap[7]]
        })
        .then(function (data) {
            if (data && parseInt(data.count) > 0) {
                caseThreeCount = parseInt(data.count);
            }
            var query = "select count(id) from user_answer where qid = $1 and answer = $2";
            var param = [3, qMap[8]]
        })
        .then(function (data) {
            if (data && parseInt(data.count) > 0) {
                caseFourCount = parseInt(data.count);
            }
            if (((caseOneCount && caseTwoCount) && caseThreeCount ) || ((caseOneCount && caseTwoCount) || caseFourCount) || (caseThreeCount && caseFourCount) || (caseOneCount || caseTwoCount || caseThreeCount || caseFourCount)) {
               // throw exceptions.conflictOfInterest(appConstants.MESSAGES.conflictOfInterest)
                errMap.push(appConstants.MESSAGES.conflictOfInterest)
                response.case = 2;
                qerror.push("Conflict of Interest")
                return;
            } else {
                return;
            }
        })
        .then(function () {
            if (qMap[28] == 'yes') {
                // Check for Prenuptial Agreement
                errMap.push(appConstants.MESSAGES.prenuptialAgreement)
                qerror.push("Prenuptial Agreement");
                // throw exceptions.prenuptialAgreement(appConstants.MESSAGES.prenuptialAgreement)
            }
            if (qMap[29] == 'yes') {
                // Check for bankruptcyProvisions
                errMap.push(appConstants.MESSAGES.bankruptcyProvisions)
                qerror.push("Bankruptcy Provisions");
                //throw exceptions.bankruptcyProvisions(appConstants.MESSAGES.bankruptcyProvisions)
            }
            var time = qMap[23]
            let oneYear = appConstants.TIME.ONE_YEAR;
            var twoYear = 2*oneYear;
            var currentTime = new Date();
            if (time < (currentTime - twoYear)) {
                //  //Time since Separation of De-Facto
                errMap.push(appConstants.MESSAGES.separationOfDeFacto)
                qerror.push("Time since Separation of De-Facto")
                //throw exceptions.separationOfDeFacto(appConstants.MESSAGES.separationOfDeFacto)
            }
            var cTime = qMap[12]
            if (cTime < (currentTime - twoYear)) {
                if (qMap[13] == 'no') {
                    if (qMap[24] == 'no') {
                        //  Date of Cohabitation
                        qerror.push("Date of Cohabitation")
                        errMap.push(appConstants.MESSAGES.dateOfCohabitation)
                    }
                }
            }
            var cTime = qMap[17]
            if (cTime < (currentTime - oneYear)) {
                //    Time since Divorce;
                qerror.push("Time since Divorce");
                errMap.push(appConstants.MESSAGES.timeSinceDivorce)
            }

            if (qMap[4] == 'no' || qMap[5] == 'no' || qMap[9] == 'no' || qMap[10] == 'no') {
                qerror.push("Australian Citizenship or Residency")
                errMap.push(appConstants.MESSAGES.nonAusis)
            }
            if (errMap.length > 0) {
                alert = true;
                var insertQuery = {}
                insertQuery.columnValues = ['uid', 'qid', 'atype', 'answer', 'createdat', 'updatedat', 'roption'];
                insertQuery.table = "user_answer";
                insertQuery.returningData = " returning id";
                var dataToInsert = []
                _.forEach(responseData, function (data) {
                    var obj = {}
                    obj.uid = uid;
                    obj.qid = data.qid;
                    obj.answer = data.answer;
                    obj.atype = data.atype
                    obj.createdat = appUtils.currentUnixTimeStamp();
                    obj.updatedat = new Date();
                    obj.roption = data.roption;
                    console.log("data.roption:" + data.roption)
                    dataToInsert.push(obj)
                })
                insertQuery.dataToInsert = dataToInsert;
                //return 1;
                baseDao.insertAndReturnData(insertQuery)
                return errMap;
            }
            var insertQuery = {}
            insertQuery.columnValues = ['uid', 'qid', 'atype', 'answer', 'createdat', 'updatedat', 'roption'];
            insertQuery.table = "user_answer";
            insertQuery.returningData = " returning id";
            var dataToInsert = []
            _.forEach(responseData, function (data) {
                var obj = {}
                obj.uid = uid;
                obj.qid = data.qid;
                obj.answer = data.answer;
                obj.atype = data.atype
                obj.createdat = appUtils.currentUnixTimeStamp();
                obj.updatedat = new Date();
                obj.roption = data.roption;
                console.log("data.roption:" + data.roption)
                dataToInsert.push(obj)
            })
            insertQuery.dataToInsert = dataToInsert;
            //return 1;
            return baseDao.insertAndReturnData(insertQuery)
        })
        .then(function (insertedData) {
            if (alert) {
                response.msg = insertedData
                response.case = 3;
                response.status = appConstants.STATUS.UNSUCCESSFULL_QUALIFICATION
                let updateQuery = "update users set status = $1 ,qualifysubmittime = $2 , qerror = $3  where id = $4 returning id";
                let param = [appConstants.STATUS.UNSUCCESSFULL_QUALIFICATION, appUtils.currentUnixTimeStamp() ,{qerror} , uid]
                userService.updateUser(updateQuery, param  , uid)
                return response
            } else {
                response.msg = insertedData[0]
                response.case = 1
                // user status update

                var updateQuery = "update users set status = $1 , qualifysubmittime = $2 where id = $3 returning id";
                var param = [appConstants.STATUS.QUALIFIED,appUtils.currentUnixTimeStamp() , uid]
                userService.updateUser(updateQuery, param)
                response.status = appConstants.STATUS.QUALIFIED
                return response;
                //return insertedData[0]

            }

        })
    /*then(function (data) {
     return response;
     })*/
}

/**
 *
 * @param answer
 * @param uid
 */
function processAnswer(data, uid) {
    data.isEdit = 0;
    //var query = "select  ua.answer ,ua.roption from (select * from question where sno = $1   ) q  LEFT JOIN (select * from user_answer where uid = $2) ua on   q.qid = ua.qid  ORDER BY q.sorder"
    var query = "select count(*) from user_answer where uid = $1 and qid = $2";
    var param = [uid, data.qid]
    return userService.executeQuery(query, param)
        .then(function (answer) {
            if(answer && parseInt(answer.count)){
                data.isEdit = 1;
            }
            var query = "select u.id , u.email , c.cid from  (select * from users where id = $1)  u  INNER JOIN (select * from cases where uid = $2) c ON u.id = c.uid"
            var param = [uid, uid]
            return userService.executeQuery(query, param)
        })
        .then(function (user) {
            if (data.qid &&
                ( data.qid == 68
                    || data.qid == 76
                    || data.qid == 91
                    || data.qid == 108
                    || data.qid == 124
                    || data.qid == 133
                    || data.qid == 143
                    || data.qid == 173
                    || data.qid == 270
                    || data.qid == 274
                    || data.qid == 393
                    || data.qid == 419
                    || data.qid == 422
                    || data.qid == 425
                    || data.qid == 428
                    || data.qid == 431
                    || data.qid == 434
                    || data.qid == 436
                    || data.qid == 446
                    || data.qid == 559
                    || data.qid == 585
                    || data.qid == 588
                    || data.qid == 591
                    || data.qid == 594
                    || data.qid == 597
                    || data.qid == 600
                    || data.qid == 602
                    || data.qid == 612
                )) {

                if (data.answer == "yes") {
                    /**
                     * Send red flag
                     */
                    emailService.sendRedFlagEmail(user.email, user.id, user.cid)
                }
            }
            if (data.isEdit) {
                var updateQuery = "update user_answer set answer = $1 , roption = $2 where uid = $3 and qid = $4 returning uid"
                var param = [data.answer, data.roption, uid, data.qid];
                return userService.updateUser(updateQuery, param);
            } else {
                var insertQuery = {}
                insertQuery.columnValues = ['uid', 'qid', 'atype', 'answer', 'createdat', 'updatedat', 'roption'];
                insertQuery.table = "user_answer";
                insertQuery.returningData = " returning id";
                var dataToInsert = []
                var obj = {}
                obj.uid = uid;
                obj.qid = data.qid;
                obj.answer = data.answer;
                obj.atype = data.atype
                obj.createdat = appUtils.currentUnixTimeStamp();
                obj.updatedat = new Date();
                obj.roption = data.roption
                dataToInsert.push(obj)
                insertQuery.dataToInsert = dataToInsert;
                return baseDao.insertAndReturnData(insertQuery)
                    .then(function (insertedData) {
                        // update  last question with section
                        var updateQuery = "update users set lastquestionid = $1 , lastquestionsection = $2 where id = $3 returning id";
                        /**
                         * TODO
                         * REMOVE HARD CODING
                         *
                         * @type {[*]}
                         */
                        data.sno = 1;
                        var param = [data.qid,data.sno , uid]
                        userService.updateUser(updateQuery, param)
                        return insertedData[0]
                    })
            }
        })
}
/**
 *GEt all question
 * @param uid
 * @param sid
 * @param rank
 * @param pageNo
 * @param pageSize
 * @returns {Request}
 */
function getAllQuestions(uid, sid,  pageNo, pageSize) {
    var res = {}
    var rank ;
// get all rank and section id
    //  uid = 1;
    var query = "select * from section where sid > $1 ORDER BY srank"
    var param = [2]
    var ranks = [];
    var sIds = [];
    var sidRankmap;
    if (!pageNo) {
        pageNo = 1
    }
    if (!pageSize) {
        pageSize = 10
    }
    var startIndex = pageNo - 1 * pageSize;
    return sectionService.executeMultiQuery(query, param)
        .then(function (sections) {
            if (sections) {
                sidRankmap = _.reduce(sections, function (hash, value) {
                    var key = value["srank"];
                    hash[key] = value.sid;
                    return hash;
                }, {});
                _.each(sections, function (section) {
                    ranks.push(section.srank);
                    //sIds.push((section.sid));
                })
               // ranks = ranks.sort();
                if (!rank) {
                    rank = ranks[0]
                }
                _.each(ranks, function (rank) {
                    sIds.push(sidRankmap[rank]);
                })
                if (!sid) {
                    sid = sIds[0]
                }
                // "select * from question q  , (select * from user_answer uid = 1)"
                var query = "select q.id , q.qid , q.section ,  q.rparty , q.levelname , q.haschild , q.sorder , q.ismandatory , q.qdescription ,  q.checklist , q.lforbrief , q.datatype , q.radios ,q.childerns , q.sno , ua.answer , ua.roption from (select * from question where sno = $1  ) q  LEFT JOIN (select * from user_answer where uid = $2) ua on   q.qid = ua.qid ORDER BY q.sorder"
                //     var query = "select q.id , q.qid , q.section ,  q.rparty , q.levelname , q.haschild , q.sorder , q.ismandatory , q.qdescription ,  q.checklist , q.lforbrief , q.datatype , q.childerns , q.sno , ua.answer from (select * from question where sno = $1  ) q  LEFT JOIN (select * from user_answer where uid = $2) ua on   q.qid = ua.qid ORDER BY q.sorder"
                var param = [sid, uid]
                return questionService.executeMultiQuery(query, param)
            } else {
                throw exceptions.sectionNotFound(appConstants.MESSAGES.sectionNotFound)
            }
        })
        .then(function (data) {
            res.data = data;
            var query = "select a.sno  , a.count , b.sname from (select sno  , count(*)  from question where sorder < $1 GROUP BY sno ) a INNER JOIN ( select * from section where sid > $2 ORDER BY srank) b on a.sno = b.sid";
            var param = [1000 ,2]
            return questionService.executeMultiQuery(query, param)
        })
        .then(function (counts) {
            res.sections = counts;
            return res;
        })


}

function importdQuestion() {

}

module.exports = {
    importQuestion,
    deleteAllQuestions,
    getAllQualifyingQuestions,
    processResponse,
    getAllQuestions,
    processAnswer,
    importdQuestion

}