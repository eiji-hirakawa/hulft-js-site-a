var express = require("express");
var router = express.Router();

// sqlite init
var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");
// sqlite initialize table
// db.serialize(() => {
//     var create = new Promise((resolve, reject) => {
//         db.get("select count(*) from sqlite_master where type='table' and name=$name", {
//             $name: "demo_table"
//         }, (err, res) => {
//             var exists = res["count(*)"] > 0;
//             resolve(exists);
//         })
//     });
//     create.then((exists) => {
//         if (!exists) {
//             db.run("create table demo_table (id integer primary key, username text, password text)");
//         }
//     });
// });
// // sqlite insert
// var insert = (param) => {
//     db.serialize(() => {
//         db.run("insert or ignore into demo_table (id, username, password) values($id, $nm, $pw)",
//             {
//                 $id: param.id,
//                 $nm: param.username,
//                 $pw: param.password
//             })
//     });
// };
// // sqlite select-each (async)
// var selectEach = (condition, callback) => {
//     db.serialize(() => {
//         db.each("select id, username, password from demo_table, where id > ?",
//             [condition.id],
//             (err, row) => {
//                 if (err) {
//                     throw err;
//                 }
//                 callback(row);
//             });
//     });
// };
// // sqlite select-all (async)
// var selectAll = (condition, callback) => {
//     db.serialize(() => {
//         db.all("select id, username, password from demo_table where id > ?",
//             [condition.id],
//             (err, rows) => {
//                 if (err) {
//                     throw err;
//                 }
//                 rows.forEach((row) => {
//                     callback(row);
//                 });
//             });
//     });
// };
// // sqlite select-value (sync)
// var selectValue = (condition) =>
//     new Promise((resolve, reject) => {
//         db.serialize(() => {
//             db.get("select username, password from demo_table where id = $id",
//                 { $id: condition.id },
//                 (err, res) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(res);
//                 });
//         });
//     });
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
// router.get("/", (req, res, next) => {

//     // tx test search
//     var condition = {
//         id: "123"
//     };
//     selectValue(condition).then(
//         (value) => {
//             console.log("selectValue result: %s", value);
//             res.render("login", {title: "login test success", result : value});
//         },
//         (reason) => {
//             console.log("selectValue failed: %s", reason);
//             res.render("login", {title: "login test failed", result : value});
//         }
//     );

// });

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
