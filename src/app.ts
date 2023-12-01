import express, { Express, Request, Response } from "express";
import config from "config";
import { object } from "zod";
import { dbconnect, db } from "./db";
import { Hotels } from "../models/hotel";
import { Document } from "mongoose";
import cors from 'cors';

const port = config.get<number>("port");
const app: Express = express();
app.use(cors());

dbconnect();

app.use(express.json()); // Add this middleware to parse JSON requests

app.get("/getHotels", async (req: Request, res: Response) => {
  try {
    const hotels: Document[] = await Hotels.find({}).lean().exec();

    res.status(200).json({ hotels });
  } catch (error) {
    console.error("Error getting hotels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/searchHotels", async (req: Request, res: Response) => {
    try {
        console.log("called");
        const startsWithLetter  = req.query.startsWithLetter
        console.log(startsWithLetter);
       
    if (!startsWithLetter) {
      // Handle the case where startsWithLetter is not provided
      return res.status(400).json({ error: "Missing startsWithLetter parameter" });
    }
      
        const hotels: Document[] = await Hotels.find({ Name: { $regex: `^${startsWithLetter}`, $options: 'i' } }).lean().exec();
      console.log(hotels);
      res.status(200).json({ hotels });
    } catch (error) {
      console.error("Error getting hotels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.post("/addHotels", async (req: Request, res: Response) => {
  try {
    const result = await Hotels.create(req.body);

    res.status(201).json({ result });
  } catch (error) {
    console.error("Error adding hotels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// IMyKJnJ1K7sS1yugqQ7AKE0rX1o4kSU4
// 2pakNOSriwSR0ylo
// curl "https://test.api.amadeus.com/v1/security/oauth2/token" \
//      -H "Content-Type: application/x-www-form-urlencoded" \
//      -d "grant_type=client_credentials&client_id={IMyKJnJ1K7sS1yugqQ7AKE0rX1o4kSU4}&client_secret={2pakNOSriwSR0ylo}"