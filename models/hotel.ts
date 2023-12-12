import mongoose ,{Schema,Document}from "mongoose";

interface dish extends Document{
    Name : string,
    Price : Number,
    Rating : Number,
    Images:String,
    Vote:Number,

}
interface Review {
    userId: string;
    comments: string;
    Rating: number;
  }
const DishSchema = new mongoose.Schema<dish>({
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Rating: { type: Number, required: true, min: 1, max: 5 },
    Images: { type: String, required: true },
    Vote: { type: String, required: true },
})
const ReviewSchema = new mongoose.Schema<Review>({
    userId: { type: String, required: true },
    comments: { type: String, required: true },
    Rating: { type: Number, required: true },
  });

interface Hotel extends Document {
    Name: string;
    Type:string;
    Location: string;
    Sub_Location:string;
    Images:string[];
    Cuisine: string[];
    Delievery_Rating: Number;
    Dining_Rating:Number;
    Cost_Per_Person:Number;
    Review:Review[];
    Opening:string;
    Working_days:string;
    Dishes: {
        [key: string]: dish[];
      }[];
  }
const HotelSchema= new mongoose.Schema<Hotel>({
    Name: { type: String, required: true },
    Type:  { type: String, required: true },
    Location: { type: String, required: true },
    Sub_Location:{ type: String, required: true },
    Images:{ type: [String], required: true },
    Cuisine: { type: [String], required: true },
    Delievery_Rating: { type: Number, required: true, min: 1, max: 5 },
    Dining_Rating: { type: Number, required: true, min: 1, max: 5 },
    Cost_Per_Person: { type: Number, required: true },
    Review: { type: [ReviewSchema], required: true },
    Opening: { type: String, required: true },
    Working_days: { type: String, required: true },
    Dishes: {
        type: Schema.Types.Mixed,
        required: true,
      }, // Array of dish subdocuments

})

const Hotels = mongoose.model<Hotel>("hotels",HotelSchema);
export {Hotels};