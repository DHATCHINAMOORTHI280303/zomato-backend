import express, { NextFunction, Request, Response } from "express"
import {googleredirect, login, loginverify, loginwithoutemail, logout, signup, signupverify,onload} from "../controllers/authcontroller";
import { passport } from "../utils/passport"; 

const authRoutes = express.Router();

authRoutes.post("/onload",onload);

authRoutes.get("/signup/google", passport.authenticate("google", {
  scope: ['profile', 'email']
}))
authRoutes.get("/signup/google/redirectt", passport.authenticate('google'),googleredirect);

authRoutes.post("/signup",signup);

authRoutes.post("/signup/verify",signupverify);

authRoutes.post("/login",login);

authRoutes.post("/login/verify",loginverify);

authRoutes.post("/login/withoutEmail",loginwithoutemail);

authRoutes.get("/logout",logout);

authRoutes.get("/login/google", passport.authenticate("google", {
  scope: ['profile', 'email']
}))

authRoutes.get("/login/google/redirect", passport.authenticate("google"),googleredirect)

export { authRoutes };