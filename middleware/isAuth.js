export const isAuth = (req, res, next) => {
    console.log("Session in isAuth:", req.session.isLoggedIn);
    if(!req.session.isLoggedIn){
        return res.redirect('/login');  //if not logged in redirect to login page
    }
    next(); //if logged in then move to next middleware
}