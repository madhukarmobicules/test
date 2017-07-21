'use strict';

//========================== Load Modules Start ==========================

//========================== Load Internal Modules =======================

const DefaultConfig = require("./default");

//========================== Load Modules End ============================

//========================== Class Definitions Start =====================

class StagingConfig extends DefaultConfig {
  constructor() {
    super();

    // override dev property, should be constants
    this.TAG = "staging";
      this.projectURL = "/home/ubuntu/jenkins/workspace/legal-logix-api"
      this.baseURL = "dev.algoworks.com/logix/api/v1";
      this.webBaseUrl = "52.14.28.32"
  }
}

//========================== Class Definitions End =======================

module.exports = StagingConfig;
