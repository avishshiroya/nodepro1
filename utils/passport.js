import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import dotenv from "dotenv"
dotenv.config()
passport.use( new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI,
    passReqToCallback: true
},
    function async (request, accessToken, refreshToken, profile, done) {
        // user.findOrCreate({ googleId: profile.id }, function (err, user) {
            console.log(null,profile)
        return done(null, profile);
        // });
    }
));
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})