import express, { NextFunction, Request, Response } from "express"

import { Users } from "../models/user/user";
import { Token } from "../models/user/refresh";
import {Activity} from "../models/user/activity";

import passport, { AuthenticateOptions, use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken } from "../utils/tokengenerator"
import jwt from "jsonwebtoken"
import {googleredirect, login, loginverify, loginwithoutemail, logout, signup, signupverify} from "../controllers/authcontroller";

interface iuser {
  _id?: String,
  Name: String,
  Email: String,
  GoogleId?: String,
  ProfilePic?: String,
  MobileNo?: String,
  Description?:String,
  Handle?: String[],
  Website?: String
}


// s://zomato-nuit.onrender.com

passport.use(
  new GoogleStrategy({
    callbackURL: "http://localhost:4000/signup/google/redirectt",
    clientID: "602927526483-729hetb1iu3ejamt0pgime5dutm3vpd2.apps.googleusercontent.com",
    clientSecret: "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"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);
      let user :any = await Users.findOne({ Email: profile.emails?.[0]?.value })
      if (!user) {
        user = await Users.create({
          Name: profile.displayName,
          Email: profile.emails?.[0]?.value,
          GoogleId: profile.id,
          ProfilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
        })
        const access = createAccessToken(user._id);
        // const refresh = createRefreshToken(user._id);
        await Activity.create({
            _id:user._id,
        })
        const token = await Token.create({
          _id: user._id,
          // refreshToken:refresh,
          accessToken: access,
        })
      }
      else {
        user = await Users.findOneAndUpdate({ Email:  profile.emails?.[0]?.value }, { $set: { GoogleId: profile.id, ProfilePic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined } })
        const access = createAccessToken(user._id);
        // const refresh = createRefreshToken(user._id);
        await Token.updateOne({ _id: user._id }, { $set: { accessToken: access } })

      }
      return done(null, user._id)

    } catch (error) {
      return done(error)

    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user:any, done) => {
  done(null, user);
});

export{passport};