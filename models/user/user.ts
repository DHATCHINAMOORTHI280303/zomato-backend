import mongoose ,{Document} from "mongoose";
import validator from "validator";

interface user extends Document{
    Name : String,
    Email : String,
    City?:String,
    GoogleId?: String,
    ProfilePic?: String,
    MobileNo?:String,
    Description?:String,
    Handle?:String[],
    Website?:String
    
}
const userSchema = new mongoose.Schema<user>({
    Name: {
        type: String,
        required: [true, "please enter your name"],
    },
    Email: {
        type: String,
        required: [true, "please enter the email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "please enter valid email"],
    },
    City:{type:String,default:null},
    GoogleId: { type: String ,default:null},
    ProfilePic: { type: String ,default:null},
    MobileNo: { type: String ,default:null},
    Description: { type: String ,default:null },
    Handle: { type: [String] ,default:null},
    Website: { type: String ,default:null}
},
    { timestamps: true }
)

const Users = mongoose.model<user>("users",userSchema);
export{Users};