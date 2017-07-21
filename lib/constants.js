"use strict";


const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1
};

const ROLES = {
    SUPERADMIN: 1,
    ADMIN: 2,
    CLIENT : 3
};

const STATUS = {
    UNVERIFIED: 1,
    ACTIVE: 2,
    SUSPENDED : 3,
    TEST_CASE_CREATED : 4,
    UNSUCCESSFULL_QUALIFICATION : 5 ,
    QUALIFIED : 6,
    TNC_ACCEPTED : 7,
};

const TIME = {
    ONE_YEAR: 365*24*60*60*1000,
    ACTIVE: 2,
    SUSPENDED : 3,
    TEST_CASE_CREATED : 4,
    UNSUCCESSFULL_QUALIFICATION : 5 ,
    QUALIFIED : 6
};

const MESSAGES = {
    intrnlSrvrErr: "Please try after some time.",
    emailAlrdyRegistered : "An account already exists for this email.",
    invalidEmail : "Invalid Email",
    requiredField : "Mandatory fields are missing or value getting blank in mandatory fields.",
    registerUserMsg : "Account has been created and  We have emailed instructions to verify your email.",
    resendVerificationLink :"We have again emailed instructions to verify your email.",
    wrongPassword :"Your Password seems to be incorrect.",
    actNotRecognised :"This email is not recognised in the system. Click the Sign Up button to create an account.",
    accountSuspended : "You have been locked out of your account. Please contact us via our support page or by phone.",
    suspendedAccount : "Your account has been suspended. If you have concerns, please contact us via our support page.",
    emailNotVerified :"Your email is not verified , Please verify and login again.",
    emailAlreadyVerified :"Email is already verified.",
    forgotPasswordLinkSend : "We have emailed you a link. This link will expire after 24 hours or upon use. If you don’t click it, or don’t change your password, nothing will happen.",
    changedPassword :"Password Changed successfully.",
    emailVerified : "We have successfully verified your email.",
    someThingWrong :" Something went wrong ie: email not found..",
    invalidToken :"Verification token is invalid or expaired.",
    notAdmin : "Please login using admin or superadmin.",
    userAlreadyAdded :"User with this email is already added.",
    shouldBeAdminOrSU : "User type should be admin or super admin.",
    passwordAlreadySet :"Pasword already set.",
    conflictOfInterest : "Unfortunately, we are unable to assist you on this particular occasion. We apologise for any inconvenience. If you believe you may have made an error in your responses to our questions, then please contact us to enable us to assist you to make the necessary changes to your responses.",
    prenuptialAgreement :"You are a party to a prenuptial agreement and as a result this product is not suitable for you",
    bankruptcyProvisions :"As you are bankrupt or subject to an arrangement under the provisions of the bankruptcy act this product is not suitable for you.",
    separationOfDeFacto :"The time limit for you to make an application to the Family Court for a property settlement has expired and you now require the permission of the court to bring an application. You should make this application to the Family Court at the earliest possible date.",
    dateOfCohabitation : "You do not appear to have the necessary legal status to commence proceedings in the Family Court of Australia and as a result this product is not suitable for you.",
    timeSinceDivorce : "The time limit for you to make an application to the Family Court for a property settlement has expired and you now require the permission of the court to bring an application. You should make this application to the Family Court at the earliest possible date.",
    nonAusis :"You do not appear to have the necessary legal status to commence proceedings in the Family Court of Australia and as a result this product is not suitable for you.",
    cntRestPassword : "Can not changes password as email is not verified.",
    caseAlreadyCreated : "User have already created case.",
    resetTokenIsInvalid :"Invalid Reset Password token",
    tncAccepted : "Term and condition accepted successfully.",
    reqiredFieldMissing :"Required field missing .",
    notSuccessFullQualification :"You are looking for invalid page."



};

const dashboard = {

}

const QID = {
    PERIOD_OF_COHABITATION  : 12,
    PRENUPTIAL_AGREEMENT : 28,
    DATE_OF_SEPRATION1 : 20,
    DATE_OF_SEPRATION2: 23,
    RELATIONSHIP_TYPE : 14,
    MARRIAGE_DATE : 15 ,
    DIVORCE_DATE : 17,
    C_CURRENT_RELATIONSHIP_W_F_P : 55,
    PROPERTY_SETTELMENT : 143 ,
    CHILED_MAINTENENCE : 149 ,
    PARENTING_ORDER : 155 ,
    SPOUSE_MAINTENENCE : 151 ,
    DOMESTIC_VOILENCE : 163,
    OTHER_PROCEDINGS : 167,
    C_NAME1 : 1 ,
    C_NAME2 : 617,
    P_NAME1 : 6 ,
    P_NAME2: 617 ,
    C_AGE : 3 ,
    P_AGE : 8,
    C_AUSIS_CITIZEN :4,
    P_AUSIS_CITIZEN :9,
    C_AUSIS_RESI :5,
    P_AUSIS_RESI :10,
    C_CURRENT_HEALTH_STATUS : 41  ,
    P_CURRENT_HEALTH_STATUS :  51,
    C_H_I_EMPLOYMENT : 42 ,
    P_H_I_EMPLOYMENT : 52,
    C_U_OCCU : 34,
    P_U_OCCU : 47,
    C_UN_EMPLOYED : 37 ,
    P_UN_EMPLOYED : 1000,
    C_RE_PARTNERED : 62 ,
    P_RE_PARTNERED : 70,
    C_DV_ALLIGATION_BY : 76 ,
    P_DV_ALLIGATION_BY : 68,
    /**
     * TODO DEPENDENT CHILDREN
     * DEPENDENT OTHER
     */

    // NON FINANCIAL
    R_N_F_CHILDCARE : 80,
    R_N_F_HOMEMAKING : 180 ,
    R_N_F_P_RENOVATION : 184 ,
    R_N_F_UNPAID_WORK : 192,
    S_N_F_P_RENOVATION : 188






}
const ADMIN_EMAIL  ="madhukar.pandey@mobicules.com"

//========================== Export Module Start ===========================

module.exports = {
    STATUS_CODE ,
    MESSAGES ,
    ROUTE_PREFIX:"/logix/api/v1/",
    ROLES,
    STATUS,
    TIME,
    QID,
    ADMIN_EMAIL
};

//========================== Export Module END ===========================
