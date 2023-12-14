import express ,{Request,Response} from "express";
import {Hotels} from "../models/hotel";
import { Dish} from "../models/dish"
import mongoose ,{Document} from "mongoose";
import { start } from "repl";
import {getHotel,filter,search,addHotels} from "../controllers/hotelcontroller";

const router = express.Router();

router.get("/search", search);

router.get("/:Location", filter);

router.get("/:Location/:Sub_Location/:Name", getHotel)

  

router.post("/addHotels", addHotels);

  export {router};