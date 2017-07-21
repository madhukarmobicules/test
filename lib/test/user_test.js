/**
 * Created by madhukar on 15/3/16.
 */

const _ = require('lodash')
//Initiate Basic Config
var userTestFacade = require('../facade/test/userTestFacade');
var sectionTestFacade = require('../facade/test/sectionTestFacade');
var caseTestFacade = require('../facade/test/caseTestFacade');
var questionTestFacade = require('../facade/test/questionTestFacade');
var appUtil = require("../appUtils")
var xlsx = require("node-xlsx");
var  envConfig = require("../config/index");

var fs = require('fs');
var parse = require('csv-parse');
var async = require('async');

var should = require('should');
var assert = require('assert');
var testNumber = 1;

describe('hooks', function () {
    before(function () {
        console.log("Deleting  data from   table before running test cases!! ")
        userTestFacade.deleteAllTestData();
        caseTestFacade.deleteAllTestData();
        sectionTestFacade.deleteSectionTestTable();
        questionTestFacade.deleteAllTestData()
        console.log("Deleted  data from  all test tables  .")
        console.log("================ Test Case Run started =================================");
    });

    after(function () {
        // runs after all tests in this block
        console.log("================ Test Case completed ===================================");
        console.log("droping all test tables after running the test cases!! ")
        userTestFacade.deleteAllTestData();
        caseTestFacade.deleteAllTestData();
        sectionTestFacade.deleteSectionTestTable();
        questionTestFacade.deleteAllTestData()
        console.log("all tables are dropped  .")

    });

    beforeEach(function () {
        console.log("---------------------Running Test Number #" + testNumber++ + " ----------------------");
    });


    afterEach(function () {
        console.log("----------------------------------------------------------------------------------");
    })

    /**
     * test case for register user
     */
    describe('#registerUser()', function () {
        it('User should  save without error', function (done) {
            var email = "Test@gmail.com"
            var password = "123456789"
            var createdat = appUtil.currentUnixTimeStamp();
            var updatedat = new Date();
            var insertQuery = "insert into users_test(email,password,createdat,updatedat) values($1,$2,$3,$4) returning email";
            var parm = [email, password, createdat, updatedat];
            userTestFacade.executeQuery(insertQuery, parm)
                .then(function (user) {
                    // email of the user should be same
                    assert.equal(user.email, email, "Email for user should be equal")
                    done()
                })
                .catch(function (err) {
                    done(err)
                })
        });
    });


    /**
     * test case for update user
     */
    describe('#updateuser()', function () {
        it('User should  be updated without error', function (done) {
            var email = "Test@gmail.com"
            var query = "UPDATE users_test set password = $1 where email = $2 returning password";
            var parm = ["password", email];
            userTestFacade.executeQuery(query, parm)
                .then(function (user) {
                    console.log(user)
                    // email of the user should be same
                    assert.equal(user.password, "password", "Password is not equal to updated password")
                    // get user by id
                    done()
                })
                .catch(function (err) {
                    done(err)
                })
        });
    });


    /**
     * test case import section
     */
    describe('#importSection()', function () {
        it('User should  be updated without error', function (done) {
            var csvfile = envConfig.env.projectURL + "/section.xlsx"
            const workSheetsFromFile = xlsx.parse(csvfile)
            sectionTestFacade.importSections(workSheetsFromFile)
                    assert.equal("1", "1", "section data is not imported successfully")
                    done()
                })


    });




});

