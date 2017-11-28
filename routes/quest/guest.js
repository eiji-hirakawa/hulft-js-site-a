var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {

    res.render("quest/guest", {
        title: "アンケート回答"
    });
});

module.exports = router;