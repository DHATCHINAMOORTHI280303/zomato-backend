import mongoose ,{Document} from "mongoose";
import validator from "validator";

interface user extends Document{
    Name : String,
    Email : String,
    GoogleId?: String,
    ProfilePic?: String,
    MobileNo?:String,
    Description?:String,
    Handle?:String[],
    Website?:String
    
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
    GoogleId:{type : String},
    ProfilePic :{type : String},
    MobileNo:{type : String},
    Description:{type : String},
    Handle:{type : [String]},
    Website:{type : String}

})

const Users = mongoose.model<user>("users",userSchema);
export{Users};