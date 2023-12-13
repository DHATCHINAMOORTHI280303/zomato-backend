import express, { Express, Request, Response } from "express";
import config from "config";
import { object } from "zod";
import { dbconnect, db } from "./db";
import { Hotels } from "../models/hotel";
import { Document } from "mongoose";
import cors from 'cors';
import {router} from "../routes/hotel";
import {authRoutes} from "../routes/authRoutes"
import bodyParser, { BodyParser } from "body-parser";
import session from "express-session";
import passport from "passport";

const port = config.get<number>("port");
const app: Express = express();
// app.use(cors());
// CORS Express Enables CORS Requests
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
//     credentials: true,
//   }),
// );
// app.use(cors());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://zomato-nuit.onrender.com','http://zomato-nuit.onrender.com:3000'],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({extended:true}));
dbconnect();

app.use(express.json()); // Add this middleware to parse JSON requests

app.use(session({ 
  secret: 'RDM SECRET SESSION', 
  resave: false, saveUninitialized: false ,
  cookie: {
   // Ensure that this is set to true for HTTPS
   httpOnly:false,
    sameSite: "none",
    secure:true
  }, 
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/user', (req, res) => {
  console.log('Session ID:', req.sessionID);
  console.log('User:', req.user);
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

app.use(authRoutes);
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// IMyKJnJ1K7sS1yugqQ7AKE0rX1o4kSU4
// 2pakNOSriwSR0ylo
// curl "https://test.api.amadeus.com/v1/security/oauth2/token" \
//      -H "Content-Type: application/x-www-form-urlencoded" \
//      -d "grant_type=client_credentials&client_id={IMyKJnJ1K7sS1yugqQ7AKE0rX1o4kSU4}&client_secret={2pakNOSriwSR0ylo}"


// 602927526483-729hetb1iu3ejamt0pgime5dutm3vpd2.apps.googleusercontent.com
// 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


//recovery code twilio : XTXPKYEPFNEX87ELUHEV9JPS

//token : 39Am8j5Vqb9AlcJBh5Zb2QocDBPz