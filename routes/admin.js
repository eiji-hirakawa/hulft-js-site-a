var express = require("express");
var router = express.Router();

var sqlite = require("../app_modules/db.js");
var db = sqlite.init("../db/demo.db");

// // socket.io server
// var socket = require('socket.io-client')('http://localhost:3000');
// socket.on('connect', function(){
//     console.log("admin.js socket connect");
// });
// socket.on('event', function(data){
//     console.log("admin.js socket event");
// });
// socket.on('disconnect', function(){
//     console.log("admin.js socket disconnect");
// });



// var socketio = require("socket.io")();
// // クライアント接続あり
// socketio.on("connection", (socket) => {
//     // 接続通知→クライアント
//     socketio.emit("sendMessageToClient", { value: "entry guest" });
//     // クライアントからの受信
//     socket.on("sendMessageToServer", (data) => {
//         socketio.emit("sendMessageToClient", { value: data.value });
//     });

//     //接続切れイベントを設定
//     socket.on("disconnect", function () {
//         socketio.emit("sendMessageToClient", { value: "exit guest" });
//     });

// });
var getWorksheets = (callback) => {
    db.serialize(() => {
        db.each("select * from Worksheet",
            (err, row) => {
                if (err) {
                    throw err;
                }
                callback(row);
            });
    });
};
router.get("/", (req, res, next) => {
    getWorksheets(row => {
        var id = row.Id;
        console.log("id : " + id);
    });
    res.render("admin", {
        title: "アンケート管理",
        datas :[
            "foo",
            "var",
            "bin"
        ]
    });
});

module.exports = router;