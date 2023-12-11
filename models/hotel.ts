import mongoose ,{Document}from "mongoose";

interface dish extends Document{
    Name : string,
    Price : Number,
    Rating : Number,
    Images:String,
    Vote:Number,

}
const DishSchema = new mongoose.Schema<dish>({
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Rating: { type: Number, required: true, min: 1, max: 5 },
    Images: { type: String, required: true },
    Vote: { type: String, required: true },
})

interface Hotel extends Document {
    Name: string;
    Location: string;
    Sub_Location:string;
    Images:string[];
    Cuisine: string[];
    Delievery_Rating: Number;
    Dining_Rating:Number;
    Opening:string;
    Working_days:string;
    Dishes: {
        [key: string]: dish[];
      }[];
  }
const HotelSchema= new mongoose.Schema<Hotel>({
    Name: { type: String, required: true },
    Location: { type: String, required: true },
    Sub_Location:{ type: String, required: true },
    Images:{ type: [String], required: true },
    Cuisine: { type: [String], required: true },
    Delievery_Rating: { type: Number, required: true, min: 1, max: 5 },
    Dining_Rating: { type: Number, required: true, min: 1, max: 5 },
    Dishes: {type:[Object],required:true}, // Array of dish subdocuments

})

const Hotels = mongoose.model<Hotel>("hotels",HotelSchema);
export {Hotels};