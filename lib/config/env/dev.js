'use strict';

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class DevConfig extends DefaultConfig {
    constructor() {
        super();

        // override dev property
        this.TAG = "development";
        this.baseURL = "dev.algoworks.com/logix/api/v1";
        this.projectURL = "/home/ubuntu/jenkins/workspace/legal-logix-api"
        this.webBaseUrl = "52.41.4.104"


    }
}

//========================== Class Definitions End =======================

module.exports = DevConfig;
