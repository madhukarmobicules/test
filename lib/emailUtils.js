'use strict';

var envConfig = require("./config/index");
var cons = require("./config/index");
var Promise = require('bluebird');
var sendGrid = require('sendgrid')(envConfig.env.sg.API_KEY);
var RECEIVER_EMAIL = "to";
var RECEIVER_NAME = "toname";
var SUBJECT = "subject";
var TEXT = "text";
var HTML = "html";
var SENDER_EMAIL = "from";
var SENDER_NAME = "fromname";
var TEMPLATE = "template_Id";
const appConst = require('./constants')


module.exports = {

    sendMail: function (emailMessage) {
        var params = {};
        if (!emailMessage.senderName) {
            params[SENDER_NAME] = envConfig.env.sg.FROM_NAME;

        } else {
            params[SENDER_NAME] = emailMessage.senderName;
        }
        if (!emailMessage.senderEmail) {
            params[SENDER_EMAIL] = envConfig.env.sg.FROM;
        }
        else {
            params[SENDER_EMAIL] = emailMessage.senderEmail;
        }
        params[SUBJECT] = emailMessage.subject;
        params[TEXT] = "";
        // Get footer content for email
        var emailBody = "";
        if (emailMessage.body) {
            emailBody += emailMessage.body;
            emailBody += ("\nfooter");
        }

        params[HTML] = emailBody.toString();
        params[RECEIVER_EMAIL] = emailMessage.receiverEmail;
        params[RECEIVER_NAME] = emailMessage.receiverName;
        if (emailMessage.templateId) {
            params[TEMPLATE] = emailMessage.templateId;
        } else {
            params[TEMPLATE] = "";
        }
        var content, subject;
        var helper = require('sendgrid').mail;
        var from_email = new helper.Email(params[SENDER_EMAIL], params[SENDER_NAME]);
        var to_email = new helper.Email(params[RECEIVER_EMAIL], params[RECEIVER_NAME]);
        if (params[HTML]) {
            content = new helper.Content('text/html', params[HTML]);
        }
        if (params[SUBJECT]) {
            subject = params[SUBJECT];
        }

        var mail = new helper.Mail(from_email, subject, to_email, content);
        mail.setFrom(from_email);
        var personalization = new helper.Personalization();
        personalization.addTo(to_email);
        mail.addPersonalization(personalization);
        if (emailMessage["substitutes"]) {
            emailMessage["substitutes"].forEach(function (sub) {
                mail.personalizations[0].addSubstitution(
                    new helper.Substitution(sub["key"], sub["value"]));
            })
        }
        mail.setTemplateId(params[TEMPLATE]);

        var request = sendGrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        //With promise
        return sendGrid.API(request)
            .then(function (response) {
                console.log({response: response}, "_sendGridMailSent");
                return Promise.resolve(response);
            })
            .catch(error => {
                //error is an instance of SendGridError
                //The full response is attached to error.response
                console.log(error, "_mailSend");
            });
    }


};

