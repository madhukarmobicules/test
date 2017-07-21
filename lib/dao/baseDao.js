var pgp = require('pg-promise')(/*options*/);
var db = pgp(  {
    host: 'localhost', // server name or IP address;
        port: '5432',
        database: 'logixdb',
        user: 'logix',
        password: 'lOgIIXx6O2fM1'

});

var insertIntoTable = function (data) {
    var cs = new pgp.helpers.ColumnSet(data.columnValues, {table: data.table});
    var query = pgp.helpers.insert(data.dataToInsert, cs)
    return db.none(query)
}

var queryFromTable = function (data) {
    return db.query(data.queryString, data.queryParams)
}

var insertAndReturnData = function (data) {
    var cs = new pgp.helpers.ColumnSet(data.columnValues, {table: data.table});
    var query = pgp.helpers.insert(data.dataToInsert, cs);
    query = query + data.returningData;
    return db.many(query)
}

var getInsertQuery = function(data, table) {
    var cs = new pgp.helpers.ColumnSet(data.columnValues, {table: table});
    return pgp.helpers.insert(data.dataToInsert, cs)
}

var getInsertAndReturnQuery = function(data, table) {
    var cs = new pgp.helpers.ColumnSet(data.columnValues, {table: table});
    var query = pgp.helpers.insert(data.dataToInsert, cs);
    if(data.returningData){
        query = query + data.returningData
    } else {
        query = query + ' returning id';
    }
    return query;
}

module.exports = {
    insertIntoTable,
    queryFromTable,
    insertAndReturnData,
    db,
    getInsertQuery,
    getInsertAndReturnQuery
}
