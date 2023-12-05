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
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
dbconnect();

app.use(express.json()); // Add this middleware to parse JSON requests

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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