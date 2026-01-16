const { User } =  require('../models/user');

const { Strategy, ExtractJwt } = require('passport-jwt');
const jwtOptions = {

    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
const jwtVerify = async (payload, done) => {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};


const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
module.exports = {
    jwtStrategy
}