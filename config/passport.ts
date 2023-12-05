

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy({
        callbackURL: "signup/google/redirect",
        clientID: "602927526483-729hetb1iu3ejamt0pgime5dutm3vpd2.apps.googleusercontent.com",
        clientSecret: "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"
    }, (accessToken, refreshToken, profile, done) => {
        console.log("callback");
    })
);
