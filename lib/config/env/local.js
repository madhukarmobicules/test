'use strict';

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class LocalConfig extends DefaultConfig {
    constructor() {
        super();

        // override dev property
        this.TAG = "local";
        this.baseURL = "localhost:3003";
        this.projectURL = "/home/madhukar/legal-logix/algo/legal-logix-api"
        this.webBaseUrl = "http://localhost:3003"
    }
}

//========================== Class Definitions End =======================

module.exports = LocalConfig;
