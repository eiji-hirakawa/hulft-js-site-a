var express = require("express");
var router = express.Router();

// sqlite init
var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");

var hasAccount = (condition) => 
    new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get("select * from demo_table where username = $nm and password = $pw",
            { $nm: condition.username, $pw: condition.password },
            (err, res) => {
                if(res){
                    resolve(res);
                }
                else {
                    reject(err);
                }
            });
        });
    });

router.get("/", (req, res, next) => {
    res.render("login", { error: "" });
});

router.post("/", (req, res, next) => {
    if(req.body.username && req.body.password){
        hasAccount({ username: req.body.username, password: req.body.password })
            .then(
                // correct
                (value) => {
                    var relativepath = req.session.referer && req.session.referer != ""
                    ? req.session.referer
                    : "/" ;
                    req.session.user = req.body.username;
                    req.session.save((err) => 
                    {
                        res.redirect(".." + relativepath);
                    });
                },
                // incorrect
                (reason) => {
                    res.render("login", {error: "入力に誤りがあります"});
                }
            );
    }
    else{
        res.render("login", {error: "入力に誤りがあります"});
    }
});
module.exports = router;
