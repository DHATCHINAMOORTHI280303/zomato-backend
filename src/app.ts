import express, { Express, Request, Response } from "express";
import config from "config";
import { object } from "zod";
import { dbconnect, db } from "./db";
import { Hotels } from "../models/hotel";
import { Document } from "mongoose";
import cors from 'cors';
import { router } from "../routes/hotel";
import { authRoutes } from "../routes/authRoutes"
import bodyParser, { BodyParser } from "body-parser";
import session from "express-session";
import passport from "passport";
import {authenticate} from "../middleware/authentication"
import cookieparser from "cookie-parser"
import {userRoutes} from "../routes/userRoutes";
import {storage,bucket,upload} from "../utils/fileupload"; 
import { Review } from "../models/reviews";
const port = config.get<number>("port");
const app: Express = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://zomato-nuit.onrender.com', 'http://zomato-nuit.onrender.com:3000'],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());
dbconnect();

app.use(express.json()); // Add this middleware to parse JSON requests

app.use(session({
  secret: 'RDM SECRET SESSION',
  resave: false, saveUninitialized: false,
  cookie: {
    // Ensure that this is set to true for HTTPS
    httpOnly: false,
    sameSite: "none",
    secure: true
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
  app.use(userRoutes)
// app.post("/add",async(req:Request,res:Response)=>{
//   console.log("called")
//   const review = req.body;
//   console.log(review)
//   const r = await Review.create(review);
//   res.status(200).json({r});

// })


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
