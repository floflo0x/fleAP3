module.exports = (req, res, next) => {
    // console.log(req.cookies.isLoggedIn, req.cookies.isLoggedIn === undefined);
    if(req.cookies.isLoggedIn === undefined) {
        return res.redirect("/");
    }
    else return next();
}