import express,{Request,Response} from "express";

import {upload} from "../utils/fileupload";

import {userblogposts, userbookmarks, useredit, usernetwork, userphotos, userreviews} from "../controllers/usercontrollers";




const userRoutes = express.Router();

userRoutes.get("/user/:id/reviews",userreviews);

userRoutes.get("/user/:id/photos",userphotos);

userRoutes.get("/user/:id/network",usernetwork);

userRoutes.get("/user/:id/bookmarks",userbookmarks);

userRoutes.get("/user/:id/blogposts",userblogposts);

userRoutes.post("/user/:id/edit", upload.single("profile"),useredit );


export{userRoutes};
