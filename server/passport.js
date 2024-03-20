const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const secretKey = '123abcdef'; // Replace with your actual secret key

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
};

passport.use(new Strategy(opts, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);

        if (user) {
            return done(null, user);
        }

        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

module.exports = passport;