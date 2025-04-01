export const errorFunction = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404', // No active link in the navigation for 404
        isAuthenticated: req.session.isLoggedIn
    });
 };