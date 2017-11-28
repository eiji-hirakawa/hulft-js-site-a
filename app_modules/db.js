
var path = require('path');
var sqlite3 = require("sqlite3");

module.exports.init = (file)  => {
    var dbPath = path.resolve(__dirname, file)    
    return new sqlite3.Database(dbPath);
};
