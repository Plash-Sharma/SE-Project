function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Attach user info to all views
function attachUserToLocals(req, res, next) {
    res.locals.authenticated = req.isAuthenticated();
    res.locals.user = req.user || null;
    res.locals.username = req.user ? req.user.username : null;
    next();
}

module.exports = { isAuthenticated, isNotAuthenticated, attachUserToLocals };
