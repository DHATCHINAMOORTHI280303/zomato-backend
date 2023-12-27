import express from "express";

import {getHotel,filter,search,addHotels} from "../controllers/hotelcontroller";
import {authenticate} from '../middleware/authentication'
import {upload } from "../utils/fileupload"
 
const router = express.Router();

router.get("/search", search);

router.get("/:Location/:Sub_Location?", filter);

router.get("/:Location/:Sub_Location/:Name", getHotel);  

router.post("/partner-with-us/create-your-res/:step/:res_id?",authenticate, addHotels);

export {router};