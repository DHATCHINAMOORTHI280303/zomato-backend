import mongoose from "mongoose";
const refreshTokenSchema = new mongoose.Schema({
    _id:{
        type:String,
        required:true,
    },
    Token:{
        type:String,
        required:true
    }
})