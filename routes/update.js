var express = require("express");
var router = express.Router();

var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");
var async = require("async");

var updateWorksheetQuestions = (id, data, callback) => {
    db.serialize(() => {
        db.run("update WorksheetQuestion set Aggregate=$val where QId=$qid and WorksheetId=$wid", data, callback);
    });
};
router.post("/", (req, res, next) => {
    var queries = [];
    for (var i = 0; i < req.body.data.length; i++) {
        queries.push({
            table: "WorksheetQuestion",
            set: "Aggregate=" + req.body.data[i].Aggregate,
            where: "QId=" + req.body.data[i].QId + " and WorksheetId=" + req.body.data[i].WorksheetId
        });
    }
    queries.push({
        table: "Worksheet",
        set: "OtherText='" + req.body.others + "'",
        where: "Id=" + req.body.id
    });
    db.serialize(() => {
        async.each(queries, (row, callback) => {
            db.run("update " + row.table + " set " + row.set + " where " + row.where, callback);
            // callback();
        }, error => {
            if (error) {
                res.render('error', {
                    message: "DBエラー",
                    error: {
                        status: error.status,
                        stack: error.stack
                    }
                });
            } else {
                res.send(200);
            }
        });
    });
});

router.get("/", (req, res) => {
    res.render("login");
});

module.exports = router;