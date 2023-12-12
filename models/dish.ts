import mongoose ,{Document} from "mongoose";

interface dish extends Document{
    Name : String,
    Available_Hotels : string[],
    Images:string
  
}
const dishSchema = new mongoose.Schema<dish>({
    Name:{type:String,required:true},
    Available_Hotels : {type :[String],required:true},
    Images :{ type :String,required:true}
   

})

const Dish = mongoose.model<dish>("dish_catlog",dishSchema);
export{Dish};