var express = require("express");
var router = express.Router();

var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");

var getWorksheets = (callback) => {
    db.serialize(() => {
        db.all("select * from Worksheet", callback);
    });
};


router.get("/", (req, res, next) => {
    getWorksheets((err, rows) => {
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
            res.render("admin", {
                title: "アンケート管理",
                datas :rows
            });
        }
    });
});

module.exports = router;