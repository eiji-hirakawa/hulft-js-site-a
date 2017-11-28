
module.exports.sessionCheck = (req, res, next) => {
    if(req.session.user){
        next();
    }
    else{
        req.session.referer = req.url;
        res.redirect("/login");
    }
};