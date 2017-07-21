"use strict";

//========================== Class Definitions Start =====================

//========================== Export module end =========================

class DefaultConfig {
    constructor() {
        this.TAG = "local";
        this.isProd = false;
        // Server port
        this.appPort = 3003;
        // Server IP
        this.hostIP = '127.0.0.1';
        this.hostName = 'localhost';
        this.JWT_TOKEN_SECRET = "bf23d39ca08631ea94370d597324338b";
        this.baseURL = "localhost:3003/logix/api/v1";
        this.webBaseUrl = "http://localhost:3003"
        this.projectURL = "/home/madhukar/legal-logix/algo/legal-logix-api"
        /**
         * Using personal ,
         * TODO
         * Need to be replaced by client account
         * @type {{USER: string, KEY: string, FROM: string, FROM_NAME: string, API_KEY: string}}
         */
        this.sg = {
            "USER": "",
            "KEY": "wETo8wa4Qh-5F6IPWuX9XA",
            "FROM": "madhukar.pandey@mobicules.com",
            "FROM_NAME": "Mail",
            "API_KEY": "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"
        };

        this.templateIds = {
            "verifyEmail": "75b88632-7a34-4071-933b-889f3b755f1c",
            "forgotPass": "b5c6686f-7c6e-44d7-b98c-c4a0461d60c5",
            "setAdminPassword" :"f3df0b3c-dfa2-475f-bda3-cc0eefbcb11a"
        }

}

    getConfigs() {
        return this;
    }
}

//========================== Class Definitions End =====================


//========================== Export module start =======================

module.exports = DefaultConfig;

//========================== Export module end =========================

