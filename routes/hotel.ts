import express ,{Request,Response} from "express";
import {Hotels} from "../models/hotel";
import { Dish} from "../models/dish"
import mongoose ,{Document} from "mongoose";
import { start } from "repl";
const router = express.Router();

router.get("/search", async (req: Request<{},{},{},{startsWithLetter?:string}>, res: Response) => {
    try {
        console.log("called");
        const startsWithLetter   = req.query.startsWithLetter
        console.log(startsWithLetter);
       
    if (!startsWithLetter) {
      // Handle the case where startsWithLetter is not provided
      return res.status(400).json({ error: "Missing startsWithLetter parameter" });
    }
    if(startsWithLetter.length==1){
      const search : Document[] =  await Hotels.find({ Name: { $regex: `^${startsWithLetter}`, $options: 'i' } }).lean().exec();
      console.log(search);
      res.status(200).json({ search });
      
    }
    if(startsWithLetter.length > 1){
      const search : Document[] =  await Dish.find({ Name:  { $regex: new RegExp(`\\b${startsWithLetter}`, "i") } }).lean().exec();
      const search1 :Document[] = await Hotels.find({ Name:{ $regex: new RegExp(`\\b${startsWithLetter}`, "i") }}).lean().exec();
      console.log(search1);
      const temp = search.concat(search1);
      console.log(temp);
      res.status(200).json({ temp });
    }

    } catch (error) {
      console.error("Error getting hotels:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get("/:Location", async (req: Request<{Location?:String},{},{},{Rating?:String,Cuisine?:String,cpp?:String,Pure_veg?:string}>, res: Response) => {
  try {
      const Rating = req.query?.Rating;
      const Cuisine = req.query?.Cuisine?.split(",");
      const cpp = req.query?.cpp?.split("-");
      const pure_veg = req.query.Pure_veg;
      console.log("cuisine",Cuisine);
      console.log(typeof(Cuisine));
      const query: any = { Location: req.params.Location };
      
      if (Rating) {
        query.Delievery_Rating = { $gte: Number(Rating) };
      }
  
      if (Cuisine) {
        query.Cuisine = { $in: Cuisine };
      }
  
      if (cpp) {
        query.Cost_Per_Person = { $gte: Number(cpp[0]),$lt :Number(cpp[1])};
      }
      if(pure_veg){
        query.Pure_veg = {$eq:"true"};
      }
      
      const hotels: Document[] = await Hotels.find(query).lean().exec();
      
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