const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { getUserByUsername, getUserById } = require('../database/queries');

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = getUserByUsername(username);
            if (!user) {
                return done(null, false, { message: 'Invalid username or password' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Invalid username or password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.userId);
});

passport.deserializeUser((id, done) => {
    try {
        const user = getUserById(id);
        done(null, user || false);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
