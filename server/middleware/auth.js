const passport = require('passport');
const { ApiError } = require('./apiError');
const { status } = require('http-status');

const verify = (req, res, resolve, reject) => async (err, user) => {
    if (err  || !user) {
        return reject(new ApiError(status.UNAUTHORIZED, 'Sorry, Unauthorized User Info'));
    }
    req.user = user;
    resolve();
};

const auth = () => async (req, res, next) => {
    return new Promise((resolve, reject) => {
        // Pass info to the callback here
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            verify(req, res, resolve, reject)(err, user, info);
        })(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

module.exports = auth;