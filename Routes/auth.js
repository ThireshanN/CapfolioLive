
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export const authRouter = express.Router();

// Replace these with your own Google Client ID and Secret
const GOOGLE_CLIENT_ID = '659834162586-hq30vt8gf1vu39pr2u4055t8djk0394d.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    // You can store user data in the database here
    return cb(null, profile);
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Store user data in the session
    req.session.user = {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.emails[0].value
    };

    // Successful authentication, redirect to the desired page.
    res.redirect('/');
});

authRouter.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

authRouter.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.session.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});