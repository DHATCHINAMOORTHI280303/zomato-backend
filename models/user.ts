import mongoose ,{Document} from "mongoose";
import validator from "validator";

interface user extends Document{
    Name : string,
    Email : String,
    GoogleId?: string,
    ProfilePic?: string,
    MobileNo?:string,
    Handle?:string,
    Website?:string
}
const userSchema = new mongoose.Schema<user>({
    Name : {
        type:String,
        required :[true,"please enter your name"],
    },
    Email:{
        type:String,
        required : [true,"please enter the email"],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail,"please enter valid email"],
    },
    GoogleId:String,
    ProfilePic : String,
    MobileNo:String,
    Handle:String,
    Website:String

})

const Users = mongoose.model<user>("users",userSchema);
export{Users};