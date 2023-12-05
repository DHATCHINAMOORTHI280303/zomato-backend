import express ,{Request,Response} from "express";
import {Hotels} from "../models/hotel";
import mongoose ,{Document} from "mongoose";
const router = express.Router();

router.get("/getHotels", async (req: Request, res: Response) => {
    try {
      const hotels: Document[] = await Hotels.find({}).lean().exec();
  
      res.status(200).json({ hotels });
    } catch (error) {
      console.error("Error getting hotels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.get("/searchHotels", async (req: Request, res: Response) => {
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
  
  router.post("/addHotels", async (req: Request, res: Response) => {
    try {
      const result = await Hotels.create(req.body);
  
      res.status(201).json({ result });
    } catch (error) {
      console.error("Error adding hotels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  export {router};