import mongoose from "mongoose";

interface token extends Document{
    _id:String,
    refreshToken:String,
    accessToken:String,
}

const refreshTokenSchema = new mongoose.Schema<token>({
    _id:{
        type:String,
        required:true,
    },
    accessToken:{
        type:String,
        required:true
    }
})

const Token = mongoose.model("tokens",refreshTokenSchema);
export{Token};