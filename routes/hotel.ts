import express from "express";

import {getHotel,filter,search,addHotels} from "../controllers/hotelcontroller";

const router = express.Router();

router.get("/search", search);

router.get("/:Location/:Sub_Location?", filter);

router.get("/:Location/:Sub_Location/:Name", getHotel);  

router.post("/addHotels", addHotels);

export {router};