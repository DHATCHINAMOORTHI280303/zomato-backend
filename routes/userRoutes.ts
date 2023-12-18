import express,{Request,Response} from "express";
import {Users} from "../models/user/user";
import {Activity} from "../models/user/activity";
import {Review} from "../models/reviews"
import {Network} from "../models/user/network";
import { Hotels } from "../models/hotel";

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

userRoutes.get("/:id/network",async(req:Request<{id:string},{},{},{}>,res:Response)=>{
    const id = req.params.id;
    const network = await Network.findOne({_id:id});
    const Followers = await Promise.all(network.Followers.map(async(follower)=>{
        return await Users.findOne({_id:follower})
    }))
    const Followings = await Promise.all(network.Followings.map(async(following)=>{
        return await Users.findOne({_id:following})
    }))
    res.status(200).json({Followers,Followings})
})

userRoutes.get("/:id/bookmarks",async(req:Request<{id:string},{},{},{}>,res:Response)=>{
    const id = req.params.id;
    const activity = await Activity.findOne({_id:id});
    const Bookmarks = await Promise.all(activity.Bookmarks.map(async(id)=>{
        return await Hotels.findOne({_id:id});
    }))
    res.status(200).json({Bookmarks});
})

userRoutes.get("/:id/blogposts",async(req:Request<{id:string},{},{},{}>,res:Response)=>{
    const id = req.params.id;
    const Blogposts = await Activity.findOne({_id:id},{Blog_Posts:1})
    res.status(200).json({Blogposts});
})

userRoutes.post(":/id/edit",async(req:Request<{id:string},{},{Name?:string,MobileNo?:string,City?:string,Description?:string,Handle?:string[],Website?:string,ProfilePic?:string},{}>,res:Response)=>{
    try {
        const id = req.params.id;
        const Name = req.body?.Name;
        const MobileNo = req.body?.MobileNo;
        const City = req.body?.City;
        const Description = req.body?.Description;
        const Handle = req.body?.Handle;
        const Website = req.body?.Website;
        const ProfilePic = req.body?.ProfilePic;
    
        const user = await Users.findOne({_id:id});
        if(!user){
            return res.status(404).json({err:"user not found"});    
        }
        user.Name = Name||user.Name;
        user.MobileNo = MobileNo||user.MobileNo;
        user.City = City||user.City;
        user.Description = Description||user.Description;
        user.Handle = Handle||user.Handle;
        user.Website = Website||user.Website;
        user.Website = Website||user.Website;
        user.ProfilePic = ProfilePic||user.ProfilePic;
    
        const updatedUser = await user.save();
        res.status(200).json({updatedUser});
        
    } catch (error) {
        res.status(500).json({error:"Internal server error"})
        
    }


})


export{userRoutes};
