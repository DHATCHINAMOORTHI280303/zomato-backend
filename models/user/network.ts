import mongoose ,{Document}from "mongoose";
interface network extends Document{
    _id:String;
    Followers:String[];
    Followings:String[];
}
const networkSchema = new mongoose.Schema<network>({
    _id:{type:String,required:true},
    Followers:{type:[String],required:true},
    Followings:{type:[String],required:true},
})

const Network = mongoose.model("network-user",networkSchema);

export{Network};