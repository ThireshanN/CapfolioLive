import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';

// Replace these with your own Google OAuth 2.0 credentials
const GOOGLE_CLIENT_ID = '659834162586-hq30vt8gf1vu39pr2u4055t8djk0394d.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            // To Do: Handle  user auth and store  user in the sesh.
            // For now, just returning the entire profile object coz ceebs.
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
