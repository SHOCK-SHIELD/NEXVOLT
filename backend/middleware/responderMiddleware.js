const responderOnly = (req, res, next) => {

    if (req.user && req.user.role === 'responder') {
        next();
    } else {
        return res.status(403).json({
            message: 'Access denied. Responders only.'
        });
    }

};

module.exports = responderOnly;