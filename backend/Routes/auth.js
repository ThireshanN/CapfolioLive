
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { Router } from 'express';


const router = Router();

export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('logged in users only, besides Madavi');
};

export const requireAucklandEmail = (req, res, next) => {
    if (req.isAuthenticated()) {
        //console.log('req.user.email:', req.user.id);
        const userEmail = req.user.emails[0].value;
        //console.log('req.user.email:', userEmail.endsWith("@aucklanduni.ac.nz"));
        if (userEmail.endsWith('@aucklanduni.ac.nz')) {
            return next();
        } else {
            return res.status(403).send('Uni students only, besides madavi');
        }
    } else {
        return res.status(401).send('Uni students only, besides madavi');
    }
};

export const authRouter = router;

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

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

authRouter.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.session.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

