var express = require("express");
var router = express.Router();

var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");

var getWorksheetQuestions = (id, callback) => {
    db.serialize(() => {
        db.all("select * from WorksheetQuestion where WorksheetId=" + id, callback);
    });
};
var getWorksheetOtherText = (id, callback) => {
    db.serialize(() => {
        db.all("select OtherText from Worksheet where Id=" + id, callback);
    });
};
router.post("/", (req, res, next) => {
    getWorksheetQuestions(req.body.id, (err, rows) => {
        if (err) {
            res.render('error', {
                message: "DBエラー",
                error: {
                    status: err.status,
                    stack: err.stack
                }
            });
        } else {
            getWorksheetOtherText(req.body.id, (err2, row) => {
                if (err2) {
                    res.render('error', {
                        message: "DBエラー",
                        error: {
                            status: err2.status,
                            stack: err2.stack
                        }
                    });
                } else {
                    res.send({rows:rows, others: row[0].OtherText});
                }
            });
        }
    });
});

router.get("/", (req, res) => {
    res.render("login");
});

module.exports = router;