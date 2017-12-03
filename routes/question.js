var express = require("express");
var router = express.Router();

var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");

var getWorksheetQuestions = (id, callback) => {
    db.serialize(() => {
        db.all("select * from WorksheetQuestion where WorksheetId=" + id, callback);
    });
};
router.post("/", (req, res, next) => {
    getWorksheetQuestions(req.body.id, (err, rows) => {
        if(err){
            res.render('error', {
                message: "DBエラー",
                error: {
                    status: err.status,
                    stack : err.stack
                }
            });
        }
        else{
            res.send(rows);
        }
    });
});

router.get("/", (req, res) => {
    res.render("login");
});

module.exports = router;