/**
 *
 * Created by madhukar on 28/3/17.
 */
//========================== Load Modules Start =======================


//========================== Load internal modules ====================

const resHndlr = require('../resHandler');
const ROUTE_PREFIX = require('../constants').ROUTE_PREFIX;
const usrRouter = require('./userRoutes');
const questionRoutes = require('./questionRoutes');
const adminRoutes = require('./admin/adminRoutes');
const sectionRoutes = require('./sectionRoutes');
const caseRoutes = require('./caseRoutes');
const dashboardRoutes = require('./admin/dashboardRoutes');



//========================== Load Modules End ==============================================

//========================== Export Module Start ==============================

module.exports = function (app) {

    app.use(ROUTE_PREFIX + 'user', usrRouter);
    app.use(ROUTE_PREFIX + 'question', questionRoutes);
    app.use(ROUTE_PREFIX + 'admin', adminRoutes);
    app.use(ROUTE_PREFIX + 'section', sectionRoutes);
    app.use(ROUTE_PREFIX + 'case', caseRoutes);
    app.use(ROUTE_PREFIX + 'admin/dashboard', dashboardRoutes);
    app.use(resHndlr.hndlError);

    console.log("routes attached");
};

//========================== Export Module End ===============================
