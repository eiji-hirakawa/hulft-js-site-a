var express = require("express");
var router = express.Router();

var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");


const http = require('http').Server(express());
const io = require('socket.io')(http);
// io.configure(function () { 
//     io.set("transports", ["xhr-polling"]); 
//     io.set("polling duration", 10); 
//  });
const PORT = 3200;

http.listen(PORT, () => console.log(`app-socket listening on *:${PORT}`));
// const PORT = 3200;
// var server =  express().listen(PORT);
// var io = require('socket.io').listen(server);
// var http = require('http');

var openQuestion = null;
io.on('connection', (socket) => {
    if(openQuestion){
        socket.emit("admin2client", openQuestion);
    }
    console.log(`app-socket connection of ${socket.id}`);

    socket.on("client2admin", (data) => {
        io.emit("client2admin", data);
    });
});

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

router.post("/", (req, res) => {
    db.serialize(() => {
        db.all("select * from Worksheet join WorksheetQuestion on Worksheet.Id=WorksheetQuestion.WorksheetId where Worksheet.Id=$id",
        { $id: req.body.id },
        (err, rows) => {
            if(err || rows.length == 0){
                res.status(500).send();
            }
            else{
                var row = rows[0];
                openQuestion = {
                    Id: req.body.id,
                    Index : row.Index,
                    Subject: row.Subject,
                    Content: row.Content,
                    Type: row.IsMultiple ? "checkbox" : "radio" ,
                    rows: rows
                };
                io.emit('admin2client', openQuestion);
                res.status(200).send();
            }
        });
    });
});

module.exports = router;