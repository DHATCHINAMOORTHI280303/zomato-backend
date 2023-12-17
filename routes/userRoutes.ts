import express,{Request,Response} from "express";
import {Users} from "../models/user/user";
import {Activity} from "../models/user/activity";
import {Review} from "../models/reviews"

const userRoutes = express.Router();

userRoutes.get("/:id/reviews",async(req:Request<{id:string},{},{},{}>,res:Response)=>{ 
    const id = req.params.id;
    const review = await Review.find({UserId:id});
    res.status(200).json({review});
})
userRoutes.get("/:id/photos",async(req:Request<{id:string},{},{},{}>,res:Response)=>{
    const id = req.params.id;
    const photos = await Activity.findOne({_id:id},{Photos:1})
    res.status(200).json({photos})
})
export{userRoutes};
