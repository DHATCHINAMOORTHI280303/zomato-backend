import mongoose ,{Document} from "mongoose";

interface dish extends Document{
    Name : String,
    Category:String,
    Available_Hotels : string[],
    Images:string
  
}
const dishSchema = new mongoose.Schema<dish>(
    {
        Name: { type: String, required: true },
        Category:{type:String,required:true,default:"Dish"},
        Available_Hotels: { type: [String], required: true },
        Images: { type: String, required: true }
    },
    {timestamps:true}
)

const Dish = mongoose.model<dish>("dish_catlog",dishSchema);
export{Dish};